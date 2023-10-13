import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fightRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        fightLog: z.string(), // Validate according to your JSON structure
        fighter1Id: z.number(),
        fighter2Id: z.number(),
        winnerId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const fight = await ctx.prisma.fight.create({
        data: {
          fightLog: input.fightLog,
          fighter1Id: input.fighter1Id,
          fighter2Id: input.fighter2Id,
          winnerId: input.winnerId,
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
      //console.log(fights);
      return fights;
    }),
});
