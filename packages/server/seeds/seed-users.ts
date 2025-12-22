import db from "../lib/db";
import { prisma } from "../lib/db/prisma";

async function seedUsers() {
  const items = [
    {
      email: "lp@lp.lp",
      password: "lp@lp.lp",
      verifyed: true
    },
    {
      email: "lorezz.me@gmail.com",
      password: "lorezz.me@gmail.com",
      verifyed: true
    },
  ];
  for (const item of items) {
    await db.createUserByEmailAndPassword(item);
  }
}

export default async function main() {
  let users = await db.getUsers();
  if (users.length === 0) {
    console.log("Seeding users...");
    await seedUsers();
    users = await db.getUsers();
  }
  for (const user of users) {
    if (!user.verifyed) {
      await db.setVerifyed(user.id)
    }
  }
  console.log("users", users);
  return users;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
