import { PrismaClient } from '@prisma/client';

import * as userdDb from './userDb';
import * as chartDb from './chartDb';
import * as dashboardDb from './dashboardDb';

type IncludeParams = { [key: string]: boolean | IncludeParams };

export const prisma = new PrismaClient();
export async function disconnect() {
  return prisma.$disconnect();
}

const db = {
  ...userdDb,
  ...chartDb,
  ...dashboardDb,
};

export default db;
