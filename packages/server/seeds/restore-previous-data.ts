/**
 * Restore backed-up data into the new project-based schema.
 *
 * Source files (seeds/data/):
 *   User.json      — all users
 *   Chart.json     — charts with userId
 *   Dashboard.json — dashboards with userId
 *   Slot.json      — slots referencing dashboardId + chartId
 *
 * What this script does:
 *   1. Re-create all users (preserving ids and hashed passwords)
 *   2. For each user that owns charts or dashboards, create one "Default Project"
 *      and add the user as ADMIN member of that project
 *   3. Restore charts pointing to their owner's project
 *   4. Restore dashboards pointing to their owner's project
 *   5. Restore slots (unchanged, they only reference chart/dashboard ids)
 *
 * Run with:
 *   bun run seeds/restore-previous-data.ts
 */

import { prisma } from "../lib/db/prisma";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");

// ─── Load backups ────────────────────────────────────────────────────────────

interface BackedUpUser {
  id: string;
  email: string;
  password: string;
  verifyed: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface BackedUpChart {
  id: string;
  name: string | null;
  description: string | null;
  chart: string;
  config: unknown;
  data: unknown;
  dataSource: unknown;
  publish: boolean;
  remoteUrl: string | null;
  isRemote: boolean;
  preview: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface BackedUpDashboard {
  id: string;
  name: string | null;
  description: string | null;
  publish: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface BackedUpSlot {
  dashboardId: string;
  chartId: string;
  settings: unknown;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

function load<T>(filename: string): T[] {
  const raw = readFileSync(join(dataDir, filename), "utf-8");
  return JSON.parse(raw) as T[];
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function restore() {
  console.log("🚀 Starting data restore...\n");

  const users = load<BackedUpUser>("User.json");
  const charts = load<BackedUpChart>("Chart.json");
  const dashboards = load<BackedUpDashboard>("Dashboard.json");
  const slots = load<BackedUpSlot>("Slot.json");

  console.log(`Loaded: ${users.length} users, ${charts.length} charts, ${dashboards.length} dashboards, ${slots.length} slots\n`);

  // ── Step 1: users ──────────────────────────────────────────────────────────
  console.log("👤 Restoring users...");
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        password: u.password,
        verifyed: u.verifyed,
        role: u.role,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${users.length} users restored\n`);

  // ── Step 2: one project per user that owns content ─────────────────────────
  // Collect unique ownerIds from both tables
  const ownerIds = new Set([
    ...charts.map((c) => c.userId),
    ...dashboards.map((d) => d.userId),
  ]);

  // Map userId → projectId so we can reference it when inserting content
  const userProjectMap = new Map<string, string>();

  console.log(`📁 Creating projects for ${ownerIds.size} user(s)...`);
  for (const userId of ownerIds) {
    const user = users.find((u) => u.id === userId);
    const label = user ? user.email : userId;

    const project = await prisma.project.create({
      data: {
        name: "Default Project",
        ownerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.projectMember.create({
      data: {
        userId,
        projectId: project.id,
        role: "ADMIN",
      },
    });

    userProjectMap.set(userId, project.id);
    console.log(`  ✅ Project ${project.id} → ${label}`);
  }
  console.log();

  // ── Step 3: charts ─────────────────────────────────────────────────────────
  console.log("📊 Restoring charts...");
  for (const c of charts) {
    const projectId = userProjectMap.get(c.userId);
    if (!projectId) {
      console.warn(`  ⚠️  Chart ${c.id} — no project found for userId ${c.userId}, skipping`);
      continue;
    }
    await prisma.chart.create({
      data: {
        id: c.id,
        name: c.name,
        description: c.description,
        chart: c.chart,
        config: c.config ?? undefined,
        data: c.data ?? undefined,
        dataSource: c.dataSource ?? undefined,
        publish: c.publish,
        remoteUrl: c.remoteUrl,
        isRemote: c.isRemote,
        projectId,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${charts.length} charts restored\n`);

  // ── Step 4: dashboards ─────────────────────────────────────────────────────
  console.log("📋 Restoring dashboards...");
  for (const d of dashboards) {
    const projectId = userProjectMap.get(d.userId);
    if (!projectId) {
      console.warn(`  ⚠️  Dashboard ${d.id} — no project found for userId ${d.userId}, skipping`);
      continue;
    }
    await prisma.dashboard.create({
      data: {
        id: d.id,
        name: d.name,
        description: d.description,
        publish: d.publish,
        projectId,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${dashboards.length} dashboards restored\n`);

  // ── Step 5: slots ──────────────────────────────────────────────────────────
  console.log("🔲 Restoring slots...");
  for (const s of slots) {
    await prisma.slot.create({
      data: {
        dashboardId: s.dashboardId,
        chartId: s.chartId,
        settings: s.settings ?? undefined,
        name: s.name,
        description: s.description,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${slots.length} slots restored\n`);

  console.log("🎉 Restore complete!");
}

restore()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Restore failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
