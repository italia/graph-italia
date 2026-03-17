import db from "../lib/db";
import { prisma } from "../lib/db/prisma";
import { hash } from "bcrypt";

type Role = "USER" | "ADMIN";

interface SeedUser {
  id?: string;          // Optional: for updating existing users
  email: string;
  password: string;
  verifyed?: boolean;
  role?: Role;
}

// Default users (fallback if SEED_USERS env var is not set)
const DEFAULT_USERS: SeedUser[] = [
  {
    email: "lp@lp.lp",
    password: "lp@lp.lp",
    verifyed: true,
    role: "USER"
  },

];

/**
 * Get users to seed from environment variable or use defaults
 * SEED_USERS should be a JSON array of {id?, email, password, verifyed?, role?} objects
 *
 * Examples:
 * - Create new user: {"email": "user@example.com", "password": "secret", "role": "USER"}
 * - Create admin: {"email": "admin@example.com", "password": "secret", "role": "ADMIN"}
 * - Update existing: {"id": "existing-id", "email": "new@email.com", "password": "newpass"}
 */
function getUsersToSeed(): SeedUser[] {
  const seedUsersEnv = process.env.SEED_USERS;

  if (seedUsersEnv) {
    try {
      const parsed = JSON.parse(seedUsersEnv);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`📋 Using ${parsed.length} users from SEED_USERS environment variable`);
        return parsed.map((u: any) => ({
          id: u.id,
          email: u.email,
          password: u.password,
          verifyed: u.verifyed ?? true,
          role: u.role ?? "USER"
        }));
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse SEED_USERS env var, using defaults:", e);
    }
  }

  console.log("📋 Using default seed users");
  return DEFAULT_USERS;
}

/**
 * Upsert users - creates new users or updates existing ones
 * - If id is provided: updates the user with that id
 * - If email exists: skips creation (idempotent for new installs)
 * - Otherwise: creates new user
 */
async function upsertUsers(users: SeedUser[]) {
  for (const item of users) {
    const hashedPassword = await hash(item.password, 10);

    // If id is provided, update existing user
    if (item.id) {
      const existingUser = await prisma.user.findUnique({
        where: { id: item.id }
      });

      if (existingUser) {
        console.log(`🔄 Updating user ${item.id} -> ${item.email}`);
        const updateData: any = {
          email: item.email,
          password: hashedPassword,
          verifyed: item.verifyed ?? true,
        };
        if (item.role) updateData.role = item.role;

        try {
          await prisma.user.update({ where: { id: item.id }, data: updateData });
        } catch (error: any) {
          if (error.message?.includes("Unknown argument `role`")) {
            delete updateData.role;
            await prisma.user.update({ where: { id: item.id }, data: updateData });
          } else {
            throw error;
          }
        }
        continue;
      } else {
        console.log(`⚠️ User with id ${item.id} not found, will create new`);
      }
    }

    // Check if user already exists by email
    const existingByEmail = await prisma.user.findUnique({
      where: { email: item.email }
    });

    if (existingByEmail) {
      console.log(`⏭️ User ${item.email} already exists (id: ${existingByEmail.id}), skipping...`);
      continue;
    }

    // Create new user
    console.log(`➕ Creating user: ${item.email} (role: ${item.role ?? "USER"})`);

    // Build data object - only include role if schema supports it
    const createData: any = {
      email: item.email,
      password: hashedPassword,
      verifyed: item.verifyed ?? true,
    };

    // Add role only if the field exists in the schema (backward compatible)
    if (item.role) {
      createData.role = item.role;
    }

    try {
      await prisma.user.create({ data: createData });
    } catch (error: any) {
      // If role field doesn't exist in client, retry without it
      if (error.message?.includes("Unknown argument `role`")) {
        console.log(`⚠️ Role field not supported by current Prisma client, creating without role`);
        delete createData.role;
        await prisma.user.create({ data: createData });
      } else {
        throw error;
      }
    }
  }
}

export default async function main() {
  console.log("🌱 Starting user seeding process...");

  const usersToSeed = getUsersToSeed();

  // Upsert users (idempotent - safe to run multiple times)
  if (usersToSeed.length > 0) {
    await upsertUsers(usersToSeed);
  }

  // Get final user list
  const users = await db.getUsers();

  // Ensure all users are verified
  for (const user of users) {
    if (!user.verifyed) {
      console.log(`✅ Verifying user: ${user.email}`);
      await db.setVerifyed(user.id);
    }
  }

  console.log(`🎉 Seeding complete! Total users: ${users.length}`);
  console.log("📊 Users:", users.map(u => `${u.email} (${(u as any).role ?? 'USER'})`).join(", "));
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
