import { existsSync, rmSync, writeFileSync } from "fs";
import { prisma } from "../lib/db/prisma";

const MARKER_FILE = "/tmp/legacy-schema-migrated";
const DEFAULT_PROJECT_NAME = "Default Project";

type ExistsRow = { exists: boolean };
type CountRow = { count: bigint | number };
type OwnerRow = { userId: string | null };

async function tableExists(tableName: string): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<ExistsRow[]>(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = '${tableName}'
    ) AS "exists";
  `);
  return Boolean(rows?.[0]?.exists);
}

async function columnExists(tableName: string, columnName: string): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<ExistsRow[]>(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = '${tableName}'
        AND column_name = '${columnName}'
    ) AS "exists";
  `);
  return Boolean(rows?.[0]?.exists);
}

async function tableCount(tableName: string): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<CountRow[]>(`SELECT COUNT(*)::bigint AS count FROM "${tableName}";`);
  const value = rows?.[0]?.count ?? 0;
  return typeof value === "bigint" ? Number(value) : value;
}

async function ensureProjectSchemaObjects(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "ProjectRole" AS ENUM ('USER', 'ADMIN');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "OrgRole" AS ENUM ('USER', 'ADMIN');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "ApiKeyRole" AS ENUM ('READONLY', 'READWRITE');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Project" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "ownerId" TEXT NOT NULL,
      CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ProjectMember" (
      "userId" TEXT NOT NULL,
      "projectId" TEXT NOT NULL,
      "role" "ProjectRole" NOT NULL DEFAULT 'USER',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("userId","projectId")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Org" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Membership" (
      "userId" TEXT NOT NULL,
      "orgId" TEXT NOT NULL,
      "role" "OrgRole" NOT NULL DEFAULT 'USER',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Membership_pkey" PRIMARY KEY ("userId","orgId")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "OrgProject" (
      "orgId" TEXT NOT NULL,
      "projectId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "OrgProject_pkey" PRIMARY KEY ("orgId","projectId")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ApiKey" (
      "id" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "role" "ApiKeyRole" NOT NULL DEFAULT 'READONLY',
      "expire" INTEGER NOT NULL DEFAULT 60,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "projectId" TEXT,
      CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ApiKey_key_key" ON "ApiKey"("key");`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ApiLog" (
      "id" TEXT NOT NULL,
      "method" TEXT NOT NULL,
      "endpoint" TEXT NOT NULL,
      "status" INTEGER NOT NULL,
      "responseTime" INTEGER NOT NULL,
      "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "apiKeyId" TEXT NOT NULL,
      CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
    );
  `);
}

async function ensureColumnsForBackfill(): Promise<void> {
  if (await tableExists("Chart")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Chart" ADD COLUMN IF NOT EXISTS "projectId" TEXT;`);
  }
  if (await tableExists("Dashboard")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Dashboard" ADD COLUMN IF NOT EXISTS "projectId" TEXT;`);
  }
  if (await tableExists("DataSource")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "DataSource" ADD COLUMN IF NOT EXISTS "projectId" TEXT;`);
  }
}

async function createProjectsAndBackfill(): Promise<void> {
  const hasDataSource = await tableExists("DataSource");
  const ownerRows = await prisma.$queryRawUnsafe<OwnerRow[]>(`
    SELECT DISTINCT "userId" FROM (
      SELECT "userId" FROM "Chart"
      UNION ALL
      SELECT "userId" FROM "Dashboard"
      ${hasDataSource ? 'UNION ALL SELECT "userId" FROM "DataSource"' : ""}
    ) u
    WHERE "userId" IS NOT NULL;
  `);

  for (const row of ownerRows) {
    if (!row.userId) {
      continue;
    }
    const userId = row.userId;
    let project = await prisma.project.findFirst({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: DEFAULT_PROJECT_NAME,
          ownerId: userId,
        },
        select: { id: true },
      });
    }

    await prisma.projectMember.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId: project.id,
        },
      },
      update: { role: "ADMIN" },
      create: {
        userId,
        projectId: project.id,
        role: "ADMIN",
      },
    });
  }

  await prisma.$executeRawUnsafe(`
    UPDATE "Chart" c
    SET "projectId" = p.id
    FROM "Project" p
    WHERE c."userId" = p."ownerId"
      AND c."projectId" IS NULL;
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "Dashboard" d
    SET "projectId" = p.id
    FROM "Project" p
    WHERE d."userId" = p."ownerId"
      AND d."projectId" IS NULL;
  `);

  if (hasDataSource) {
    await prisma.$executeRawUnsafe(`
      UPDATE "DataSource" ds
      SET "projectId" = p.id
      FROM "Project" p
      WHERE ds."userId" = p."ownerId"
        AND ds."projectId" IS NULL;
    `);
  }
}

async function enforceConstraintsAndCleanupLegacyColumns(): Promise<void> {
  const chartNulls = await prisma.$queryRawUnsafe<CountRow[]>(`
    SELECT COUNT(*)::bigint AS count FROM "Chart" WHERE "projectId" IS NULL;
  `);
  const dashboardNulls = await prisma.$queryRawUnsafe<CountRow[]>(`
    SELECT COUNT(*)::bigint AS count FROM "Dashboard" WHERE "projectId" IS NULL;
  `);

  if ((Number(chartNulls[0]?.count ?? 0) > 0) || (Number(dashboardNulls[0]?.count ?? 0) > 0)) {
    throw new Error("Cannot enforce projectId: some Chart/Dashboard rows are still NULL");
  }

  const hasDataSource = await tableExists("DataSource");
  if (hasDataSource) {
    const dataSourceNulls = await prisma.$queryRawUnsafe<CountRow[]>(`
      SELECT COUNT(*)::bigint AS count FROM "DataSource" WHERE "projectId" IS NULL;
    `);
    if (Number(dataSourceNulls[0]?.count ?? 0) > 0) {
      throw new Error("Cannot enforce projectId: some DataSource rows are still NULL");
    }
  }

  await prisma.$executeRawUnsafe(`ALTER TABLE "Chart" ALTER COLUMN "projectId" SET NOT NULL;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Dashboard" ALTER COLUMN "projectId" SET NOT NULL;`);
  if (hasDataSource) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "DataSource" ALTER COLUMN "projectId" SET NOT NULL;`);
  }

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Project_ownerId_fkey') THEN
        ALTER TABLE "Project"
          ADD CONSTRAINT "Project_ownerId_fkey"
          FOREIGN KEY ("ownerId") REFERENCES "User"("id")
          ON DELETE RESTRICT ON UPDATE CASCADE;
      END IF;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProjectMember_userId_fkey') THEN
        ALTER TABLE "ProjectMember"
          ADD CONSTRAINT "ProjectMember_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProjectMember_projectId_fkey') THEN
        ALTER TABLE "ProjectMember"
          ADD CONSTRAINT "ProjectMember_projectId_fkey"
          FOREIGN KEY ("projectId") REFERENCES "Project"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Chart_projectId_fkey') THEN
        ALTER TABLE "Chart"
          ADD CONSTRAINT "Chart_projectId_fkey"
          FOREIGN KEY ("projectId") REFERENCES "Project"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Dashboard_projectId_fkey') THEN
        ALTER TABLE "Dashboard"
          ADD CONSTRAINT "Dashboard_projectId_fkey"
          FOREIGN KEY ("projectId") REFERENCES "Project"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$;
  `);

  if (hasDataSource) {
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DataSource_projectId_fkey') THEN
          ALTER TABLE "DataSource"
            ADD CONSTRAINT "DataSource_projectId_fkey"
            FOREIGN KEY ("projectId") REFERENCES "Project"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `);
  }

  await prisma.$executeRawUnsafe(`ALTER TABLE "Chart" DROP CONSTRAINT IF EXISTS "Chart_userId_fkey";`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Dashboard" DROP CONSTRAINT IF EXISTS "Dashboard_userId_fkey";`);
  if (hasDataSource) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "DataSource" DROP CONSTRAINT IF EXISTS "DataSource_userId_fkey";`);
  }

  if (await columnExists("Chart", "userId")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Chart" DROP COLUMN "userId";`);
  }
  if (await columnExists("Dashboard", "userId")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Dashboard" DROP COLUMN "userId";`);
  }
  if (hasDataSource && (await columnExists("DataSource", "userId"))) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "DataSource" DROP COLUMN "userId";`);
  }

  if (await columnExists("Chart", "preview")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Chart" DROP COLUMN "preview";`);
  }
}

async function main(): Promise<void> {
  if (existsSync(MARKER_FILE)) {
    rmSync(MARKER_FILE, { force: true });
  }

  const hasChart = await tableExists("Chart");
  const hasDashboard = await tableExists("Dashboard");
  const chartHasUserId = hasChart && (await columnExists("Chart", "userId"));
  const chartHasProjectId = hasChart && (await columnExists("Chart", "projectId"));

  const isLegacySchema = hasChart && hasDashboard && chartHasUserId && !chartHasProjectId;
  if (!isLegacySchema) {
    console.log("ℹ️ Legacy schema not detected, skipping legacy migration bootstrap.");
    return;
  }

  console.log("⚠️ Legacy schema detected. Starting automatic legacy-to-project migration...");
  console.log(`📊 Chart rows: ${await tableCount("Chart")}, Dashboard rows: ${await tableCount("Dashboard")}`);

  await ensureProjectSchemaObjects();
  await ensureColumnsForBackfill();
  await createProjectsAndBackfill();
  await enforceConstraintsAndCleanupLegacyColumns();

  writeFileSync(MARKER_FILE, "1", "utf8");
  console.log("✅ Legacy schema migration completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Legacy schema migration failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
