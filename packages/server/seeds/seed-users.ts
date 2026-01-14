import db from "../lib/db";
import { prisma } from "../lib/db/prisma";

interface SeedUser {
  email: string;
  password: string;
  verifyed?: boolean;
}

// Default users (fallback if SEED_USERS env var is not set)
const DEFAULT_USERS: SeedUser[] = [
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

/**
 * Get users to seed from environment variable or use defaults
 * SEED_USERS should be a JSON array of {email, password, verifyed?} objects
 */
function getUsersToSeed(): SeedUser[] {
  const seedUsersEnv = process.env.SEED_USERS;
  
  if (seedUsersEnv) {
    try {
      const parsed = JSON.parse(seedUsersEnv);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`📋 Using ${parsed.length} users from SEED_USERS environment variable`);
        return parsed.map((u: any) => ({
          email: u.email,
          password: u.password,
          verifyed: u.verifyed ?? true
        }));
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse SEED_USERS env var, using defaults:", e);
    }
  }
  
  console.log("📋 Using default seed users");
  return DEFAULT_USERS;
}

async function seedUsers(users: SeedUser[]) {
  for (const item of users) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: item.email }
    });
    
    if (existingUser) {
      console.log(`⏭️ User ${item.email} already exists, skipping...`);
      continue;
    }
    
    console.log(`➕ Creating user: ${item.email}`);
    await db.createUserByEmailAndPassword(item);
  }
}

export default async function main() {
  console.log("🌱 Starting user seeding process...");
  
  const usersToSeed = getUsersToSeed();
  let users = await db.getUsers();
  
  // Seed users if needed (idempotent - checks each user individually)
  if (usersToSeed.length > 0) {
    await seedUsers(usersToSeed);
    users = await db.getUsers();
  }
  
  // Ensure all users are verified
  for (const user of users) {
    if (!user.verifyed) {
      console.log(`✅ Verifying user: ${user.email}`);
      await db.setVerifyed(user.id);
    }
  }
  
  console.log(`🎉 Seeding complete! Total users: ${users.length}`);
  return users;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
