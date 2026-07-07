import * as bcrypt from "bcrypt";
import dayjs from "dayjs";
import type { CodeType, User } from "./prisma/client";
import generatePin from "../pin";
import { prisma } from "./prisma";
import { createDefaultProject } from "./projectDb";

export function getUsers() {
	return prisma.user.findMany({});
}

export function getAllUsersForAdmin() {
	return prisma.user.findMany({
		select: {
			id: true,
			email: true,
			role: true,
			verified: true,
			createdAt: true,
			updatedAt: true,
			ownedProjects: {
				select: { id: true, name: true },
			},
			projectMember: {
				select: {
					project: { select: { id: true, name: true } },
				},
			},
			memberships: {
				select: {
					org: {
						select: {
							name: true,
							projects: {
								select: {
									project: { select: { id: true, name: true } },
								},
							},
						},
					},
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

export function deleteUserById(id: string) {
	return prisma.user.delete({ where: { id } });
}

export function setUserRole(id: string, role: "USER" | "ADMIN") {
	return prisma.user.update({ where: { id }, data: { role } });
}

export function findUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: {
			email,
		},
	});
}

export function findUserBySub(sub: string) {
	return prisma.user.findUnique({
		where: {
			sub,
		},
	});
}

export async function createUserByEmailAndPassword({
	email,
	password,
	sub,
}: {
	email: string;
	password: string;
	sub?: string;
}) {
	const passwordHash = bcrypt.hashSync(password, 12);
	const created = await prisma.user.create({ data: { email, password: passwordHash, sub } });
	await createDefaultProject(created.id, created.email);
	return created;
}

export function findUserById(id: User["id"]) {
	return prisma.user.findUnique({
		where: {
			id,
		},
	});
}

export function setVerified(id: string) {
	return prisma.user.update({
		where: {
			id,
		},
		data: {
			verified: true,
		},
	});
}

export async function changePassword(id: string, newPassword: string) {
	const passwordHash = bcrypt.hashSync(newPassword, 12);
	return prisma.user.update({
		where: {
			id,
		},
		data: {
			password: passwordHash,
		},
	});
}

export async function findCodeByUid(userId: string, type: CodeType) {
	const record = await prisma.verificationCode.findFirst({
		where: { userId, type, consumedAt: null },
		orderBy: { createdAt: "desc" },
	});
	if (!record) return null;
	const isExpired = dayjs().isAfter(dayjs(record.createdAt).add(1, "hour"));
	return isExpired ? null : record;
}

export async function createCode(userId: string, type: CodeType) {
	const code = generatePin();
	// Only remove unconsumed codes of the same type so ACTIVATION and RECOVERY
	// codes never interfere with each other.
	await prisma.verificationCode.deleteMany({
		where: { userId, type, consumedAt: null },
	});
	await prisma.verificationCode.create({ data: { userId, code, type } });
	return code;
}

export function consumeCode(id: string) {
	return prisma.verificationCode.update({
		where: { id },
		data: { consumedAt: new Date() },
	});
}

export function destroyCodes(userId: string) {
	return prisma.verificationCode.deleteMany({ where: { userId } });
}
