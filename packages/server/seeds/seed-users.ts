import { hash } from "bcrypt";
import db from "../lib/db";
import { prisma } from "../lib/db/prisma";

type Role = "USER" | "ADMIN";

interface SeedUser {
  id?: string;          // Optional: for updating existing users
  email: string;
  password?: string;    // Optional: omit for SPID/CIE-only accounts (no password at all)
  verified?: boolean;
  role?: Role;
}

// Default users (fallback if SEED_USERS env var is not set). No role: new
// users are created as USER, and an existing one keeps whatever role it has.
const DEFAULT_USERS: SeedUser[] = [
  {
    email: "lp@lp.lp",
    password: "lp@lp.lp",
    verified: true,
  },

];

/**
 * Get users to seed from environment variable or use defaults
 * SEED_USERS should be a JSON array of {id?, email, password?, verified?, role?} objects
 *
 * Examples:
 * - Create new user: {"email": "user@example.com", "password": "secret", "role": "USER"}
 * - Create SPID/CIE-only admin: {"email": "admin@example.com", "role": "ADMIN"}
 *   (no password: they sign in with SPID/CIE and are matched by email)
 * - Promote an existing user: {"email": "existing@example.com", "role": "ADMIN"}
 * - Update existing: {"id": "existing-id", "email": "new@email.com", "password": "newpass"}
 *
 * For admins, ADMIN_EMAILS on the server is usually simpler: no seed job, and
 * the role is granted at sign-in.
 */
function getUsersToSeed(): SeedUser[] {
  const seedUsersEnv = process.env.SEED_USERS;

  if (seedUsersEnv) {
    try {
      const parsed = JSON.parse(seedUsersEnv);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`📋 Using ${parsed.length} users from SEED_USERS environment variable`);
        // role/verified stay undefined when not given, so existing users are
        // only changed for what the entry explicitly sets.
        return parsed.map((u: any) => ({
          id: u.id,
          email: u.email,
          password: u.password || undefined,
          verified: u.verified,
          role: u.role,
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
 * - If id is provided: updates the user with that id (password only if given)
 * - If the email exists (case-insensitive): applies the given role/verified,
 *   never touches the password
 * - Otherwise: creates the user (verified unless told otherwise, with a
 *   default project), email stored lowercased like every other signup
 * Returns the ids of the seeded users.
 */
async function upsertUsers(users: SeedUser[]): Promise<string[]> {
  const seededIds: string[] = [];

  for (const item of users) {
    const email = item.email.trim().toLowerCase();
    const hashedPassword = item.password ? await hash(item.password, 10) : undefined;

    // If id is provided, update existing user
    if (item.id) {
      const existingUser = await prisma.user.findUnique({
        where: { id: item.id }
      });

      if (existingUser) {
        console.log(`🔄 Updating user ${item.id} -> ${email}`);
        await prisma.user.update({
          where: { id: item.id },
          data: {
            email,
            ...(hashedPassword ? { password: hashedPassword } : {}),
            verified: item.verified ?? true,
            ...(item.role ? { role: item.role } : {}),
          },
        });
        seededIds.push(item.id);
        continue;
      } else {
        console.log(`⚠️ User with id ${item.id} not found, will create new`);
      }
    }

    // Existing user by email: only apply what the entry explicitly sets
    const existingByEmail = await db.findUserByEmail(email);

    if (existingByEmail) {
      const data = {
        ...(item.role && item.role !== existingByEmail.role ? { role: item.role } : {}),
        ...(item.verified !== undefined && item.verified !== existingByEmail.verified ? { verified: item.verified } : {}),
      };
      if (Object.keys(data).length > 0) {
        console.log(`🔄 User ${email} already exists (id: ${existingByEmail.id}), updating ${Object.keys(data).join(", ")}`);
        await prisma.user.update({ where: { id: existingByEmail.id }, data });
      } else {
        console.log(`⏭️ User ${email} already exists (id: ${existingByEmail.id}), nothing to change`);
      }
      seededIds.push(existingByEmail.id);
      continue;
    }

    // Create new user (createUserByEmailAndPassword also creates the default project)
    console.log(`➕ Creating user: ${email} (role: ${item.role ?? "USER"}${hashedPassword ? "" : ", no password"})`);
    const created = await db.createUserByEmailAndPassword({ email, password: item.password });
    await prisma.user.update({
      where: { id: created.id },
      data: { verified: item.verified ?? true, role: item.role ?? "USER" },
    });
    seededIds.push(created.id);
  }

  return seededIds;
}

export default async function main() {
  console.log("🌱 Starting user seeding process...");

  const usersToSeed = getUsersToSeed();

  // Upsert users (idempotent - safe to run multiple times)
  const seededIds = usersToSeed.length > 0 ? await upsertUsers(usersToSeed) : [];

  // Get final user list
  const users = await db.getUsers();

  // Only the seeded users are touched: the seed may run against a live
  // database, where other accounts' verification state is not ours to change.
  for (const user of users.filter((u) => seededIds.includes(u.id))) {
    await db.createDefaultProject(user.id, user.email);
  }

  console.log(`🎉 Seeding complete! Total users: ${users.length}`);
  console.log("📊 Users:", users.map(u => `${u.email} (${u.role})`).join(", "));
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
