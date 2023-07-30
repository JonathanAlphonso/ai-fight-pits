import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(3, "60s"),
  ephemeralCache: new Map(),
  analytics: true,
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  //console.log("middleware.ts: request: ", request);
  const ip = request.ip ?? "127.0.0.1";

  // Early escape if hitting the "blocked" redirect
  if (request.nextUrl.pathname === "/api/blocked")
    return NextResponse.next(request);

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_middleware_${ip}`
  );
  event.waitUntil(pending);

  const res = success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/api/blocked", request.url));

  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", reset.toString());
  return res;
}

export const config = {
  matcher: "/api/trpc/gpt.getGPT3Response",
};
