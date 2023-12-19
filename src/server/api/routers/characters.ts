import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fightRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        fightLog: z.string(), // Validate according to your JSON structure
        fighter1Id: z.number(),
        fighter2Id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const fight = await ctx.prisma.fight.create({
        data: {
          fightLog: input.fightLog,
          fighter1Id: input.fighter1Id,
          fighter2Id: input.fighter2Id,
          createdById: ctx.session.user.id, // Assigning the user's ID to createdById
        },
      });

      //void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);

      return fight;
    }),
});
