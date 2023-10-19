import type { NextPage } from "next";
import Head from "next/head";
import AuthShowcase from "~/components/AuthShowcase";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import StoryList from "~/components/StoryList";
import type { Story } from "~/types/types";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  
  const { data: fetchedStories, isLoading } = api.fight.getAll.useQuery();

  useEffect(() => {
    if (!isLoading && fetchedStories) {
      const updatedStories = fetchedStories.map(story => ({
        ...story,
        createdBy: {
          ...story.createdBy,
          name: story.createdBy.name || 'Unknown',
          email: story.createdBy.email || '', // provide a default value
          image: story.createdBy.image || '', // provide a default value for image
        },
        createdById: story.createdBy.id, // assign the ID of the user who created the story
      }));
      setStories(updatedStories);
    }
  }, [fetchedStories, isLoading]);

  // Get the session data
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>User Fight Stories</title>
        <meta name="description" content="User-generated fight stories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex max-w-full flex-col items-center justify-center gap-12 px-4 py-16 sm:max-w-2xl ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            All Fight Stories
          </h1>
          <StoryList stories={stories} isLoading={isLoading} currentUserId={sessionData?.user?.id ?? null} />
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;