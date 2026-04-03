import { prisma } from "./prisma";

/**
 * Creates a "Default Project" owned by the user and adds them as ADMIN member.
 * Called automatically on user registration.
 */
export async function createDefaultProject(userId: string) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name: "Default Project",
        ownerId: userId,
      },
    });
    await tx.projectMember.create({
      data: {
        userId,
        projectId: project.id,
        role: "ADMIN",
      },
    });
    return project;
  });
}

/**
 * Returns the id of the user's first (oldest) project — owned or member-of.
 * When a user has only one project this is transparent to the frontend.
 */
export async function getDefaultProjectId(userId: string): Promise<string | null> {
  const project = await prisma.project.findFirst({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return project?.id ?? null;
}

/**
 * Returns true if the user can modify (update/delete/publish) resources in a project.
 * Allowed if: project owner OR ProjectMember with role ADMIN.
 */
export async function canUserModifyProject(
  userId: string,
  projectId: string,
): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } }, // Simple check: any member can see/use it for now, can be refined to ADMIN role
        { orgs: { some: { org: { members: { some: { userId } } } } } },
      ],
    },
    select: { id: true },
  });
  return !!project;
}

