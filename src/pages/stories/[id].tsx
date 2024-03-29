import type { NextPage } from "next";
import Head from "next/head";
import StoryFormatter from "~/components/StoryFormatter";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getSession } from "next-auth/react";
import type { GetServerSideProps } from 'next';
import { ssgHelper } from '~/server/api/ssgHelper';
import ClipLoader from "react-spinners/ClipLoader";

type StoryPageProps = {
  storyData: {
    id: number;
    fighter1Name: string;
    fighter2Name: string;
    fightLog: string;
    likeCount: number;
    hasUserLiked: boolean;
    time: string;
    createdBy: {
      id: string;
      name: string;
    };
    views: number;
  };
};

const SingleStoryPage: NextPage<StoryPageProps & { error?: string }> = ({ storyData: story, error }) => {
  const isLoading = false;

  if (error) {
    return (
      <>
        <Head>
          <title>Story Not Found</title>
          <meta name="description" content="The requested story could not be found" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] sm:min-h-screen">
          <div className="container flex flex-col items-center justify-center gap-4 px-4 py-4 sm:max-w-2xl sm:gap-12 sm:px-4 sm:py-16">
            <div className="text-lg text-white sm:text-2xl">
              <h1 className="text-6xl font-bold text-white">{error}</h1>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${story?.fighter1Name || "Unknown"} vs ${story?.fighter2Name || "Unknown"}`}</title>
        <meta name="description" content="Fight story" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] sm:min-h-screen">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-4 sm:max-w-2xl sm:gap-12 sm:px-4 sm:py-16">
          {isLoading ? (
            <ClipLoader color={"#ffffff"} size={150} />
          ) : (
            <>
              <div className="flex flex-col text-lg text-white sm:text-2xl">
                <div className="sm:flex">
                  <p className="mb-2 sm:mb-0 sm:mr-2">Story ID: {story?.id}</p>
                  <p className="mb-2 sm:mx-2 sm:mb-0">
                    Story created by:&nbsp;
                    <Link href={`/stories/users/${story?.createdBy.id ?? ""}`}>
                      <span className="cursor-pointer text-blue-500 hover:underline">
                        {story?.createdBy.name}
                      </span>
                    </Link>
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p>
                    {story?.time &&
                      `Created ${formatDistanceToNow(new Date(story.time))} ago`}
                  </p>
                </div>
              </div>

              <StoryFormatter
                text={story?.fightLog || ""}
                fighter1Name={story?.fighter1Name || ""}
                fighter2Name={story?.fighter2Name || ""}
                likeCount={story?.likeCount || 0}
                storyId={story.id}
                hasUserLiked={story?.hasUserLiked ?? false}
                views={story?.views ?? 0}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const ssg = ssgHelper();
  const id = context.params?.id;

  // Check if 'id' is not null and is a valid number
  if (!id || typeof id !== 'string' || isNaN(Number(id))) {
    return {
      props: {
        error: "Invalid Story ID", // Provide a more user-friendly error message
      },
    };
  }

  try {
    await ssg.fight.addView.fetch({ userId: session?.user.id || '', fightId: Number(id) });

    let storyData = await ssg.fight.getOne.fetch({ userId: session?.user.id || '', fightId: Number(id) });

    if (storyData.time) {
      storyData = {
        ...storyData,
        // @ts-expect-error: bullshit can't serialize date but also doesn't want to convert to string
        time: (storyData.time).toISOString(),
      };
    }

    return {
      props: {
        session,
        storyData,
      },
    };
  } catch (error) {
    console.error("Failed to fetch story data:", error);
    // Instead of removing the ts-ignore, handle the error by returning a specific flag or message
    return {
      props: {
        error: "Story ID Not Found", // You can use this error prop to conditionally render the error message in your component
      },
    };
  }
};

export default SingleStoryPage;
