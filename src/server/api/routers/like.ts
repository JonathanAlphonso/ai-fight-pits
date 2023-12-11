// src/server/api/routers/like.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { Context } from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({
    toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const fightId = Number(id); // convert string to number
      const data = { fightId, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_fightId: data },
      });

      if (existingLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_fightId: data } });
        return { addedLike: false };
      }
    }),
});