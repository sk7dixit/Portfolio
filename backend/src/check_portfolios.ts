import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log("Checking portfolio profiles in database...");
  const profiles = await prisma.portfolioProfile.findMany({
    include: {
      user: true
    }
  });

  console.log(`Found ${profiles.length} profiles:`);
  for (const p of profiles) {
    console.log(`- Slug: ${p.user.portfolioSlug}, User: ${p.user.name}, Email: ${p.user.email}`);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
