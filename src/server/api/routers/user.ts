// src/server/api/routers/user.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input: { name }, ctx }) => {
      const userId = ctx.session.user.id;

      // Check if the new username already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { name },
      });

      if (existingUser) {
        throw new Error('This username is already taken.');
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: { name },
      });

      return updatedUser;
    }),
  // other routes...
});