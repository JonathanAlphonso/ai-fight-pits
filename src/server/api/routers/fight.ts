import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { Context } from "~/server/api/trpc";

async function getFighterNameById(ctx: Context, id: number): Promise<string> {
  const fighter = await ctx.prisma.fighter.findUnique({
    where: { id: id },
  });

  if (!fighter) {
    throw new Error(`Fighter with id ${id} not found`);
  }

  return fighter.name;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
        fighter1 = await ctx.prisma.fighter.findUnique({
          where: { id: input.fighter1Id },
        });
      }

      if (input.fighter2Id !== undefined) {
        fighter2 = await ctx.prisma.fighter.findUnique({
          where: { id: input.fighter2Id },
        });
      }

      // If fighters don't exist, create new entries
      if (!fighter1) {
        fighter1 = await ctx.prisma.fighter.create({
          data: {
            name: toTitleCase(input.fighter1Name),
            description: "Default description",
            powerRating: 0,
          },
        });
      }
      if (!fighter2) {
        fighter2 = await ctx.prisma.fighter.create({
          data: {
            name: toTitleCase(input.fighter2Name),
            description: "Default description",
            powerRating: 0,
          },
        });
      }

      // Create the fight
      const fight = await ctx.prisma.fight.create({
        data: {
          fightLog: input.fightLog,
          fighter1Id: fighter1.id,
          fighter2Id: fighter2.id,
          fightWinner: input.winnerName ? input.winnerName : "Draw",
          createdById: ctx.session.user.id, // Assigning the user's ID to createdById
        },
      });

      return fight;
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: fightId, ctx }) => {
      // Check if the fight exists and was created by the current user
      const fight = await ctx.prisma.fight.findUnique({
        where: { id: fightId },
      });

      if (!fight) {
        throw new Error("Fight not found");
      }

      if (fight.createdById !== ctx.session.user.id) {
        throw new Error("Not authorized to delete this fight");
      }

      // Delete the fight
      await ctx.prisma.fight.delete({
        where: { id: fightId },
      });

      return { message: "Fight deleted successfully" };
    }),
  getAllByUser: publicProcedure
    .input(
      z.object({
        userid: z.string(),
        page: z.number().optional(),
        sort: z.string().optional(),
      })
    ) // accept userid, page, and sort as input
    .query(async ({ input, ctx }) => {
      const { userid, page = 1, sort = "newest" } = input; // get the userid, page, and sort from the input
      const limit = 5; // or however many stories you want per page
      const offset = (page - 1) * limit; // calculate the offset

      let orderBy: {
        views?: "asc" | "desc";
        likeCount?: "asc" | "desc"; // Changed this line
        time?: "asc" | "desc";
      };
      switch (sort) {
        case "mostViewed":
          orderBy = { views: "desc" };
          break;
        case "mostLiked":
          orderBy = { likeCount: "desc" }; // Changed this line
          break;
        default:
          orderBy = { time: "desc" };
      }

      const fights = await ctx.prisma.fight.findMany({
        where: {
          createdById: userid, // use the userid to fetch the fights
        },
        include: { createdBy: true }, // Include the createdBy user
        orderBy,
        take: limit,
        skip: offset,
      });

      // Get the names of the fighters and ensure createdBy.name is not null
      const fightsWithNames = fights.map(async (fight) => {
        const fighter1Name = await getFighterNameById(ctx, fight.fighter1Id);
        const fighter2Name = await getFighterNameById(ctx, fight.fighter2Id);

        // Check if the user has liked the fight
        const hasUserLiked =
          ctx.session && ctx?.session.user
            ? (await ctx.prisma.like.findUnique({
                where: {
                  userId_fightId: {
                    userId: ctx.session.user.id,
                    fightId: fight.id,
                  },
                },
              })) != null
            : false;

        return {
          ...fight,
          fighter1Name,
          fighter2Name,
          createdBy: {
            ...fight.createdBy,
            name: fight.createdBy.name || "Unknown",
          },
          likeCount: fight.likeCount, // Directly access the likeCount field
          hasUserLiked, // Return whether the user has liked the fight
        };
      });

      return Promise.all(fightsWithNames);
    }),
  getAll: publicProcedure
    .input(
      z.object({ page: z.number().optional(), sort: z.string().optional() })
    ) // accept page and sort as input
    .query(async ({ input, ctx }) => {
      const { page = 1, sort = "newest" } = input; // get the page and sort from the input
      const limit = 5; // or however many stories you want per page
      const offset = (page - 1) * limit; // calculate the offset

      let orderBy: {
        views?: "asc" | "desc";
        likeCount?: "asc" | "desc"; // Changed this line
        time?: "asc" | "desc";
      };
      switch (sort) {
        case "mostViewed":
          orderBy = { views: "desc" };
          break;
        case "mostLiked":
          orderBy = { likeCount: "desc" }; // Changed this line
          break;
        case "newest":
          orderBy = { time: "desc" };
          break;
        default:
          orderBy = { time: "desc" };
      }

      const fights = await ctx.prisma.fight.findMany({
        include: { createdBy: true },
        orderBy,
        take: limit,
        skip: offset,
      });

      // Get the names of the fighters and ensure createdBy.name is not null
      const fightsWithNames = fights.map(async (fight) => {
        const fighter1Name = await getFighterNameById(ctx, fight.fighter1Id);
        const fighter2Name = await getFighterNameById(ctx, fight.fighter2Id);

        // Check if the user has liked the fight
        const hasUserLiked =
          ctx.session && ctx.session.user
            ? (await ctx.prisma.like.findUnique({
                where: {
                  userId_fightId: {
                    userId: ctx.session.user.id,
                    fightId: fight.id,
                  },
                },
              })) != null
            : false;

        return {
          ...fight,
          fighter1Name,
          fighter2Name,
          createdBy: {
            ...fight.createdBy,
            name: fight.createdBy.name || "Unknown",
          },
          likeCount: fight.likeCount, // Directly access the likeCount field
          hasUserLiked, // Return whether the user has liked the fight
        };
      });

      return Promise.all(fightsWithNames);
    }),
  getOne: publicProcedure
    .input(z.object({ userId: z.string(), fightId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const { userId, fightId } = input;
      const fight = await ctx.prisma.fight.findUnique({
        where: { id: fightId },
        include: { createdBy: true }, // Include the createdBy user
      });

      if (!fight) {
        throw new Error("Fight not found");
      }

      const fighter1Name = await getFighterNameById(ctx, fight.fighter1Id);
      const fighter2Name = await getFighterNameById(ctx, fight.fighter2Id);

      // Check if the user has liked the fight
      const hasUserLiked = userId
        ? (await ctx.prisma.like.findUnique({
            where: { userId_fightId: { userId: userId, fightId: fight.id } },
          })) != null
        : false;

      return {
        ...fight,
        fighter1Name,
        fighter2Name,
        createdBy: fight.createdBy, // Return the createdBy user
        id: fight.id, // Return the id of the fight
        likeCount: fight.likeCount, // Directly access the likeCount field
        hasUserLiked, // Return whether the user has liked the fight
      };
    }),
  addView: publicProcedure
    .input(z.object({ userId: z.string(), fightId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const { fightId } = input; // Correctly destructure input to get fightId
      // Increment the viewCount field by 1
      const fight = await ctx.prisma.fight.update({
        where: { id: fightId },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      if (!fight) {
        throw new Error("Fight not found");
      }

      return { message: "View added successfully" };
    }),
});
