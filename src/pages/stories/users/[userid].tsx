import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import Head from "next/head";
import StoryList from "~/components/StoryList";
import { useRouter } from 'next/router';

import { useStories } from "~/hooks/useStories";

const UserStories: NextPage = () => {
  const router = useRouter();
  const userid = typeof router.query.userid === 'string' ? router.query.userid : '';
  const { data: session } = useSession(); // Add this line
  const currentUserId = session?.user?.id ?? ''; // Add this line
  const { stories, isLoading} = useStories(userid);

  let title = "Your Fight Stories";
  if (currentUserId !== userid) {
    const name = stories[0]?.createdBy.name || 'Unknown';
    title = `${name}'s Fight Stories`;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="User-generated fight stories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex max-w-full flex-col items-center justify-center gap-12 px-4 py-16 sm:max-w-2xl ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            {title}
          </h1>
          <StoryList
            stories={stories}
            isLoading={isLoading}
            currentUserId={session?.user?.id ?? 'Unknown'}
          />
        </div>
      </main>
    </>
  );
};

export default UserStories;