import type { NextPage } from "next";
import Head from "next/head";
import AuthShowcase from "~/components/AuthShowcase";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import StoryList from "~/components/StoryList";

// Define a type for Story
type Story = {
  id: number; // Removed undefined
  fightLog: string;
  fighter1Name: string | null;
  fighter2Name: string | null;
  // Add other properties of a story if there are any
};

const Home: NextPage = () => {
  // Renamed to fetchedStories to avoid shadowing
  const { data: fetchedStories, isLoading } = api.fight.getAll.useQuery(
    {}
  );

  // Use Story[] instead of any[] for the stories state
  const [stories, setStories] = useState<Story[]>(fetchedStories || []); // Initialize to fetchedStories or an empty array
  // Use useEffect to update stories when fetchedStories is available and isLoading is false
  useEffect(() => {
    if (!isLoading && fetchedStories) {
      setStories(fetchedStories);
    }
  }, [fetchedStories, isLoading]); // Dependency array

 

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
          <StoryList stories={stories} isLoading={isLoading} />
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;