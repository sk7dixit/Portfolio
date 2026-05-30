import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log("Locating khushaboo profile...");
  const user = await prisma.user.findFirst({
    where: { portfolioSlug: 'khushaboo' }
  });

  if (!user) {
    console.error("User not found!");
    return;
  }

  const profile = await prisma.portfolioProfile.findFirst({
    where: { userId: user.id }
  });

  if (!profile) {
    console.error("Profile not found!");
    return;
  }

  const section = typeof profile.projectsSection === 'string'
    ? JSON.parse(profile.projectsSection)
    : (profile.projectsSection as any || {});

  section.heading = "PROJECTS";

  await prisma.portfolioProfile.update({
    where: { id: profile.id },
    data: {
      projectsSection: section
    }
  });

  console.log("Successfully updated projectsSection heading to PROJECTS!");
}

run().catch(console.error).finally(() => prisma.$disconnect());
