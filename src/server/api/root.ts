import { fightRouter } from "./routers/fight";
import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { gptRouter } from "~/server/api/routers/gpt";
import { likeRouter } from "~/server/api/routers/like";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  gpt: gptRouter,
  fight: fightRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
