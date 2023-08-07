//modified to run on vercel edge
//https://www.charlesharris.dev/blog/run-trpc-on-the-edge

import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
  region: "cle1",
};

export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: createTRPCContext,
  });
}
