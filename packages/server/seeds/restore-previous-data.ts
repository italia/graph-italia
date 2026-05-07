/**
 * Restore backed-up data into the database after a reset.
 *
 * Source files (seeds/data/):
 *   User.json          — users
 *   Org.json           — organisations
 *   Project.json       — projects
 *   ProjectMember.json — project memberships
 *   Membership.json    — org memberships
 *   OrgProject.json    — org ↔ project associations
 *   Chart.json         — charts (already carry projectId)
 *   Dashboard.json     — dashboards (already carry projectId)
 *   Slot.json          — dashboard ↔ chart slots
 *
 * Restore order respects FK constraints:
 *   User / Org → Project → ProjectMember / Membership / OrgProject
 *   → Chart / Dashboard → Slot
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

// ─── Types matching the backup JSON files ────────────────────────────────────

interface BUser {
  id: string;
  email: string;
  password: string;
  verified: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface BOrg {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface BProject {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface BProjectMember {
  userId: string;
  projectId: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface BMembership {
  userId: string;
  orgId: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface BOrgProject {
  orgId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface BChart {
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
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface BDashboard {
  id: string;
  name: string | null;
  description: string | null;
  publish: boolean;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface BSlot {
  dashboardId: string;
  chartId: string;
  settings: unknown;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function load<T>(filename: string): T[] {
  const path = join(dataDir, filename);
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T[];
  } catch {
    console.warn(`  ⚠️  ${filename} not found — skipping`);
    return [];
  }
}

function d(iso: string) {
  return new Date(iso);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function restore() {
  console.log("🚀 Starting data restore…\n");

  const users       = load<BUser>("User.json");
  const orgs        = load<BOrg>("Org.json");
  const projects    = load<BProject>("Project.json");
  const members     = load<BProjectMember>("ProjectMember.json");
  const memberships = load<BMembership>("Membership.json");
  const orgProjects = load<BOrgProject>("OrgProject.json");
  const charts      = load<BChart>("Chart.json");
  const dashboards  = load<BDashboard>("Dashboard.json");
  const slots       = load<BSlot>("Slot.json");

  console.log(
    `Loaded: ${users.length} users, ${orgs.length} orgs, ` +
    `${projects.length} projects, ${members.length} project-members, ` +
    `${memberships.length} org-memberships, ${orgProjects.length} org-projects, ` +
    `${charts.length} charts, ${dashboards.length} dashboards, ${slots.length} slots\n`
  );

  // ── Step 1: Users ──────────────────────────────────────────────────────────
  console.log("👤 Restoring users…");
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        password: u.password,
        verified: u.verified,
        role: u.role,
        createdAt: d(u.createdAt),
        updatedAt: d(u.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${users.length} users\n`);

  // ── Step 2: Orgs ───────────────────────────────────────────────────────────
  if (orgs.length) {
    console.log("🏢 Restoring orgs…");
    for (const o of orgs) {
      await prisma.org.upsert({
        where: { id: o.id },
        update: {},
        create: {
          id: o.id,
          name: o.name,
          createdAt: d(o.createdAt),
          updatedAt: d(o.updatedAt),
        },
      });
    }
    console.log(`  ✅ ${orgs.length} orgs\n`);
  }

  // ── Step 3: Projects ───────────────────────────────────────────────────────
  console.log("📁 Restoring projects…");
  for (const p of projects) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        ownerId: p.ownerId,
        createdAt: d(p.createdAt),
        updatedAt: d(p.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${projects.length} projects\n`);

  // ── Step 4: Project members ────────────────────────────────────────────────
  if (members.length) {
    console.log("👥 Restoring project members…");
    for (const m of members) {
      await prisma.projectMember.upsert({
        where: { userId_projectId: { userId: m.userId, projectId: m.projectId } },
        update: {},
        create: {
          userId: m.userId,
          projectId: m.projectId,
          role: m.role,
          createdAt: d(m.createdAt),
          updatedAt: d(m.updatedAt),
        },
      });
    }
    console.log(`  ✅ ${members.length} project-members\n`);
  }

  // ── Step 5: Org memberships ────────────────────────────────────────────────
  if (memberships.length) {
    console.log("🔗 Restoring org memberships…");
    for (const m of memberships) {
      await prisma.membership.upsert({
        where: { userId_orgId: { userId: m.userId, orgId: m.orgId } },
        update: {},
        create: {
          userId: m.userId,
          orgId: m.orgId,
          role: m.role,
          createdAt: d(m.createdAt),
          updatedAt: d(m.updatedAt),
        },
      });
    }
    console.log(`  ✅ ${memberships.length} org-memberships\n`);
  }

  // ── Step 6: Org ↔ project associations ────────────────────────────────────
  if (orgProjects.length) {
    console.log("🔀 Restoring org-project links…");
    for (const op of orgProjects) {
      await prisma.orgProject.upsert({
        where: { orgId_projectId: { orgId: op.orgId, projectId: op.projectId } },
        update: {},
        create: {
          orgId: op.orgId,
          projectId: op.projectId,
          createdAt: d(op.createdAt),
          updatedAt: d(op.updatedAt),
        },
      });
    }
    console.log(`  ✅ ${orgProjects.length} org-project links\n`);
  }

  // ── Step 7: Charts ─────────────────────────────────────────────────────────
  console.log("📊 Restoring charts…");
  let skipped = 0;
  const projectIds = new Set(projects.map((p) => p.id));
  for (const c of charts) {
    if (!projectIds.has(c.projectId)) {
      console.warn(`  ⚠️  Chart ${c.id} — unknown projectId ${c.projectId}, skipping`);
      skipped++;
      continue;
    }
    await prisma.chart.upsert({
      where: { id: c.id },
      update: {},
      create: {
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
        projectId: c.projectId,
        createdAt: d(c.createdAt),
        updatedAt: d(c.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${charts.length - skipped} charts restored${skipped ? `, ${skipped} skipped` : ""}\n`);

  // ── Step 8: Dashboards ─────────────────────────────────────────────────────
  console.log("📋 Restoring dashboards…");
  skipped = 0;
  for (const dd of dashboards) {
    if (!projectIds.has(dd.projectId)) {
      console.warn(`  ⚠️  Dashboard ${dd.id} — unknown projectId ${dd.projectId}, skipping`);
      skipped++;
      continue;
    }
    await prisma.dashboard.upsert({
      where: { id: dd.id },
      update: {},
      create: {
        id: dd.id,
        name: dd.name,
        description: dd.description,
        publish: dd.publish,
        projectId: dd.projectId,
        createdAt: d(dd.createdAt),
        updatedAt: d(dd.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${dashboards.length - skipped} dashboards restored${skipped ? `, ${skipped} skipped` : ""}\n`);

  // ── Step 9: Slots ──────────────────────────────────────────────────────────
  console.log("🔲 Restoring slots…");
  skipped = 0;
  const chartIds     = new Set(charts.map((c) => c.id));
  const dashboardIds = new Set(dashboards.map((d) => d.id));
  for (const s of slots) {
    if (!dashboardIds.has(s.dashboardId)) {
      console.warn(`  ⚠️  Slot (${s.dashboardId}/${s.chartId}) — unknown dashboardId, skipping`);
      skipped++;
      continue;
    }
    if (!chartIds.has(s.chartId)) {
      console.warn(`  ⚠️  Slot (${s.dashboardId}/${s.chartId}) — unknown chartId, skipping`);
      skipped++;
      continue;
    }
    await prisma.slot.upsert({
      where: { dashboardId_chartId: { dashboardId: s.dashboardId, chartId: s.chartId } },
      update: {},
      create: {
        dashboardId: s.dashboardId,
        chartId: s.chartId,
        settings: s.settings ?? undefined,
        name: s.name,
        description: s.description,
        createdAt: d(s.createdAt),
        updatedAt: d(s.updatedAt),
      },
    });
  }
  console.log(`  ✅ ${slots.length - skipped} slots restored${skipped ? `, ${skipped} skipped` : ""}\n`);

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
