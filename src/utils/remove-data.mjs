import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const deleteAllRows = await prisma.fight.deleteMany();
  console.log(`Deleted ${deleteAllRows.count} rows from the table`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
