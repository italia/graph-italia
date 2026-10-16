import type { Prisma } from "./prisma/client";
import { prisma } from "./prisma";

/**
 * Accounts whose emails differ only by case. Lookups are case-insensitive
 * (see findUserByEmail), so these are ambiguous: the admin panel lists them
 * and merges each group into the account the admin picks.
 */

export class MergeError extends Error {}

export interface DuplicateEmailUser {
	id: string;
	email: string;
	role: "USER" | "ADMIN";
	verified: boolean;
	hasPassword: boolean;
	createdAt: Date;
	identities: number;
	ownedProjects: number;
	projectMemberships: number;
	orgMemberships: number;
}

export interface DuplicateEmailGroup {
	email: string;
	users: DuplicateEmailUser[];
}

export async function findDuplicateEmailGroups(): Promise<DuplicateEmailGroup[]> {
	const keys = await prisma.$queryRaw<{ key: string }[]>`
		SELECT lower(email) AS key FROM "User" GROUP BY lower(email) HAVING count(*) > 1`;
	if (keys.length === 0) return [];

	const users = await prisma.user.findMany({
		where: { OR: keys.map(({ key }) => ({ email: { equals: key, mode: "insensitive" as const } })) },
		select: {
			id: true,
			email: true,
			role: true,
			verified: true,
			password: true,
			createdAt: true,
			_count: { select: { identities: true, ownedProjects: true, projectMember: true, memberships: true } },
		},
		orderBy: { createdAt: "asc" },
	});

	const groups = new Map<string, DuplicateEmailUser[]>();
	for (const { password, _count, ...user } of users) {
		const key = user.email.toLowerCase();
		const list = groups.get(key) ?? [];
		// Never ship the password hash to the panel, only whether there is one.
		list.push({
			...user,
			hasPassword: password !== null,
			identities: _count.identities,
			ownedProjects: _count.ownedProjects,
			projectMemberships: _count.projectMember,
			orgMemberships: _count.memberships,
		});
		groups.set(key, list);
	}
	return [...groups].map(([email, users]) => ({ email, users }));
}

const roleRank = (role: string) => (role === "ADMIN" ? 1 : 0);

/**
 * Folds `mergeIds` into `keepId` inside the given transaction, then deletes
 * them. Nothing the merged accounts own is lost: deleting a user cascades to
 * its projects, so projects, SPID/CIE identities and project/org memberships
 * move to the kept account first (on a shared project/org the higher role
 * wins). The kept account ends up verified/ADMIN/with a password if any of
 * the merged ones was, and with its email lowercased.
 */
export async function mergeUsersTx(tx: Prisma.TransactionClient, keepId: string, mergeIds: string[]) {
	const ids = [...new Set(mergeIds)].filter((id) => id !== keepId);
	if (ids.length === 0) throw new MergeError("Nothing to merge.");

	const users = await tx.user.findMany({ where: { id: { in: [keepId, ...ids] } } });
	const keep = users.find((u) => u.id === keepId);
	if (!keep || users.length !== ids.length + 1) throw new MergeError("User not found.");
	const email = keep.email.trim().toLowerCase();
	if (users.some((u) => u.email.trim().toLowerCase() !== email)) {
		throw new MergeError("Users do not share the same email.");
	}
	const merged = users.filter((u) => u.id !== keepId);

	for (const user of merged) {
		await tx.project.updateMany({ where: { ownerId: user.id }, data: { ownerId: keepId } });
		await tx.oidcIdentity.updateMany({ where: { userId: user.id }, data: { userId: keepId } });

		for (const member of await tx.projectMember.findMany({ where: { userId: user.id } })) {
			const where = { userId_projectId: { userId: keepId, projectId: member.projectId } };
			const existing = await tx.projectMember.findUnique({ where });
			if (!existing) {
				await tx.projectMember.create({ data: { userId: keepId, projectId: member.projectId, role: member.role } });
			} else if (roleRank(member.role) > roleRank(existing.role)) {
				await tx.projectMember.update({ where, data: { role: member.role } });
			}
		}

		for (const membership of await tx.membership.findMany({ where: { userId: user.id } })) {
			const where = { userId_orgId: { userId: keepId, orgId: membership.orgId } };
			const existing = await tx.membership.findUnique({ where });
			if (!existing) {
				await tx.membership.create({ data: { userId: keepId, orgId: membership.orgId, role: membership.role } });
			} else if (roleRank(membership.role) > roleRank(existing.role)) {
				await tx.membership.update({ where, data: { role: membership.role } });
			}
		}

		// Cascades the leftovers: its own memberships and verification codes.
		await tx.user.delete({ where: { id: user.id } });
	}

	return tx.user.update({
		where: { id: keepId },
		data: {
			email,
			verified: keep.verified || merged.some((u) => u.verified),
			role: [keep, ...merged].some((u) => u.role === "ADMIN") ? "ADMIN" : keep.role,
			password: keep.password ?? merged.find((u) => u.password !== null)?.password ?? null,
		},
	});
}

export function mergeUsers(keepId: string, mergeIds: string[]) {
	return prisma.$transaction((tx) => mergeUsersTx(tx, keepId, mergeIds));
}
