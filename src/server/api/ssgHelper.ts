import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter,AppRouter } from "./root";
import { createInnerTRPCContext } from "./trpc";

export function ssgHelper() {
  return createServerSideHelpers<AppRouter>({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null, revalidateSSG: null }),
    transformer: superjson,
  });
}
