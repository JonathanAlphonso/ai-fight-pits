import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Context } from "~/server/api/trpc";

async function getFighterNameById(ctx: Context, id: number): Promise<string | null> {
  const fighter = await ctx.prisma.fighter.findUnique({
    where: { id: id },
  });

  return fighter ? fighter.name : null;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}



export const fightRouter = createTRPCRouter({
  
  create: protectedProcedure
  .input(
    z.object({
      fightLog: z.string(), // Validate according to your JSON structure
      fighter1Name: z.string(),
      fighter2Name: z.string(),
      fighter1Id: z.number().optional(), // Add this line
      fighter2Id: z.number().optional(), // Add this line
      winnerName: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Check if fighters exist in the database
    let fighter1, fighter2;
    if (input.fighter1Id !== undefined) {
      fighter1 = await ctx.prisma.fighter.findUnique({ where: { id: input.fighter1Id } });
    }

    if (input.fighter2Id !== undefined) {
      fighter2 = await ctx.prisma.fighter.findUnique({ where: { id: input.fighter2Id } });
    }

    // If fighters don't exist, create new entries
    if (!fighter1) {
      fighter1 = await ctx.prisma.fighter.create({ 
        data: { 
          name: toTitleCase(input.fighter1Name),
          description: 'Default description',
          powerRating: 0,
        } 
      });
    }
    if (!fighter2) {
      fighter2 = await ctx.prisma.fighter.create({ 
        data: { 
          name: toTitleCase(input.fighter2Name),
          description: 'Default description',
          powerRating: 0,
        } 
      });
    }

    // Create the fight
    const fight = await ctx.prisma.fight.create({
      data: {
        fightLog: input.fightLog,
        fighter1Id: fighter1.id,
        fighter2Id: fighter2.id,
        winnerId: input.winnerName ? (await ctx.prisma.fighter.findUnique({ where: { name: input.winnerName } }))?.id : null,
        createdById: ctx.session.user.id, // Assigning the user's ID to createdById
      },
    });

    return fight;
  }),
  getAllByUser: protectedProcedure
  .input(z.object({}))
  .query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const fights = await ctx.prisma.fight.findMany({
      where: {
        createdById: userId,
      },
    });

    // Get the names of the fighters
    const fightsWithNames = fights.map(async (fight) => {
      const fighter1Name = await getFighterNameById(ctx, fight.fighter1Id);
      const fighter2Name = await getFighterNameById(ctx, fight.fighter2Id);

      return { ...fight, fighter1Name, fighter2Name };
    });

    return Promise.all(fightsWithNames);
  }),
getAll: protectedProcedure
  .input(z.object({}))
  .query(async ({ ctx }) => {
    const fights = await ctx.prisma.fight.findMany();

    // Get the names of the fighters
    const fightsWithNames = fights.map(async (fight) => {
      const fighter1Name = await getFighterNameById(ctx, fight.fighter1Id);
      const fighter2Name = await getFighterNameById(ctx, fight.fighter2Id);

      return { ...fight, fighter1Name, fighter2Name };
    });

    return Promise.all(fightsWithNames);
  }),
});
