import * as db from '../lib/db/db';

async function seedUsers() {
  const items = [
    {
      email: 'lp@lp.lp',
      password: 'lp@lp.lp',
    },
    {
      email: 'lorezz.me@gmail.com',
      password: 'lorezz.me@gmail.com',
    },
    {
      email: 'vale@com.o',
      password: 'vale@com.o',
    },
  ];
  for (const item of items) {
    await db.createUserByEmailAndPassword(item);
  }
}

export default async function main() {
  let users = await db.getUsers();
  if (users.length === 0) {
    console.log('Seeding users...');
    seedUsers();
    users = await db.getUsers();
  }
  console.log('users', users);
  return users;
}

main()
  .then(async () => {
    await db.disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.disconnect();
    process.exit(1);
  });
