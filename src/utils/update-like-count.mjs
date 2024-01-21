import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const fights = await prisma.fight.findMany({
    include: {
      likes: true,
    },
  });

  for (const fight of fights) {
    const likeCount = fight.likes.length;
    if (fight.likeCount !== likeCount) {
      await prisma.fight.update({
        where: { id: fight.id },
        data: { likeCount: likeCount },
      });
      console.log(`Updated likeCount for fight ${fight.id} to ${likeCount}`);
    }
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });