// src/server/api/routers/like.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({
  toggleLike: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const fightId = Number(id); // convert string to number
      const data = { fightId, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_fightId: data },
      });

      if (existingLike == null) {
        // If the like does not exist, create it and increment the likeCount field
        await ctx.prisma.like.create({ data });
        await ctx.prisma.fight.update({
          where: { id: fightId },
          data: { likeCount: { increment: 1 } },
        });
        return { addedLike: true };
      } else {
        // If the like exists, delete it and decrement the likeCount field
        await ctx.prisma.like.delete({ where: { userId_fightId: data } });
        await ctx.prisma.fight.update({
          where: { id: fightId },
          data: { likeCount: { decrement: 1 } },
        });
        return { addedLike: false };
      }
    }),
  hasUserLiked: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id }, ctx }) => { // Use .query() instead of .resolve()
      const fightId = Number(id); // convert string to number
      const data = { fightId, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_fightId: data },
      });

      return existingLike != null;
    }),
});