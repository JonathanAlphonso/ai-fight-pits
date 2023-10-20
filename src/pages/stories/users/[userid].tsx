import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import Head from "next/head";
import AuthShowcase from "~/components/AuthShowcase";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import StoryList from "~/components/StoryList";
import type { Story } from "~/types/types";
import NavBar from "~/components/NavBar";
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [stories, setStories] = useState<Story[]>([]);

  const router = useRouter();
  const userid = typeof router.query.userid === 'string' 
  ? router.query.userid 
  : '';

  const { data: fetchedStories, isLoading } = api.fight.getAllByUser.useQuery(
    { userid }, // use the userid from the URL to fetch the stories
    { enabled: !!userid } // only run the query when userid is not empty
  );
  console.log(`User from URL: ${userid}`);
  console.log(`User currently logged in: ${currentUserId || 'undefined'}`);

  useEffect(() => {
    if (!isLoading && fetchedStories) {
      const updatedStories = fetchedStories.map((story) => ({
        ...story,
        createdBy: {
          ...story.createdBy,
          name: story.createdBy.name || "Unknown",
          email: story.createdBy.email || "", // provide a default value
          image: story.createdBy.image || "", // provide a default value for image
        },
        createdById: story.createdBy.id, // assign the ID of the user who created the story
      }));
      setStories(updatedStories);
    }
  }, [fetchedStories, isLoading]);

  let title = "Your Fight Stories";
  if (currentUserId !== userid) {
    title = `${(session?.user?.name || 'Unknown')}'s Fight Stories`; // replace userid with the actual user name if available
  }

  return (
    <>
      <NavBar />
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
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;