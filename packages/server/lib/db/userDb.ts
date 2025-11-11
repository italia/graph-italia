import { Prisma, PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import generatePin from '../pin';

export const prisma = new PrismaClient();

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

export function createUserByEmailAndPassword(user: Prisma.UserCreateInput) {
  user.password = bcrypt.hashSync(user.password, 12);
  return prisma.user.create({
    data: user,
  });
}

export function findUserById(id: User['id']) {
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

export async function findCodeByUid(userId: string) {
  const result = await prisma.code.findFirst({
    where: {
      userId,
    },
  });
  if (!result) return null;
  const ts = dayjs(result.createdAt);
  const anHour = 60 * 60 * 1000;
  const now = dayjs(new Date(Date.now() - anHour));
  const isExpired = ts < now;
  return isExpired ? null : result.code;
}

export async function createCode(userId: string) {
  const code = generatePin();
  await prisma.code.deleteMany({
    where: {
      userId,
    },
  });
  await prisma.code.create({
    data: {
      userId,
      code,
    },
  });
  return code;
}

export function destroyCodes(userId: string) {
  return prisma.code.deleteMany({
    where: {
      userId,
    },
  });
}
