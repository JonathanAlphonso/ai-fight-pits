import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import Head from "next/head";
import StoryList from "~/components/StoryList";
import { useStories } from "~/hooks/useStories";
import LoadingScreen from "~/components/LoadingScreen";
import type {UserStoriesProps} from "~/types/types";

const UserStories: NextPage<UserStoriesProps> = ({ userid }) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? "";

  const { stories, isLoading, error, hasMore, page, fetchMoreData,handleDelete, sort, setSort } =
    useStories(userid);
  //Shows as a big header below the navbar
  let title = "Your Fight Stories";
  if (error) return (<div>Error: {error.message}</div>);
  //Only show loading screen if it's the first page
  if (isLoading && page===1) return (<LoadingScreen/>);

  if (currentUserId !== userid) {
    const name = stories[0]?.createdBy.name || "Unknown";
    if (name === "Unknown") {
      return (
        <>
          <Head>
            <title>Story Not Found</title>
            <meta name="description" content="The requested story creator could not be found" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] sm:min-h-screen">
            <div className="container flex flex-col items-center justify-center gap-4 px-4 py-4 sm:max-w-2xl sm:gap-12 sm:px-4 sm:py-16">
              <div className="text-lg text-white sm:text-2xl">
                <h1 className="text-6xl font-bold text-white">Story Creator Not Found</h1>
              </div>
            </div>
          </main>
        </>
      );
    }
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
            hasMore={hasMore}
            fetchMoreData={fetchMoreData}
            currentUserId={session?.user?.id ?? "Unknown"}
            handleDelete={handleDelete}
            sort={sort}
            setSort={setSort}
          />
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<UserStoriesProps> = async (
  context
) => {
  const userid = context.params?.userid as string;
  return Promise.resolve({
    props: {
      userid,
    },
  });
};

export default UserStories;