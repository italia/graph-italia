import * as bcrypt from "bcrypt";
import dayjs from "dayjs";
import type { CodeType, User } from "./prisma/client";
import type { UserCreateInput } from "./prisma/models";
import generatePin from "../pin";
import { prisma } from "./prisma";
import { createDefaultProject } from "./projectDb";

export function getUsers() {
	return prisma.user.findMany({});
}

export function findUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: {
			email,
		},
	});
}

export async function createUserByEmailAndPassword(user: UserCreateInput) {
	user.password = bcrypt.hashSync(user.password, 12);
	const created = await prisma.user.create({ data: user });
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

export function setVerifyed(id: string) {
	return prisma.user.update({
		where: {
			id,
		},
		data: {
			verifyed: true,
		},
	});
}

export async function changePassword(id: string, newPassword: string) {
	const password = bcrypt.hashSync(newPassword, 12);
	return prisma.user.update({
		where: {
			id,
		},
		data: {
			password,
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
