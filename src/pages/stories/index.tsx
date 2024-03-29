import type { NextPage } from "next";
import Head from "next/head";
import StoryList from "~/components/StoryList";
import { useStories } from "~/hooks/useStories";
import LoadingScreen from "~/components/LoadingScreen";


const AllUserStories: NextPage = () => {
  

  const { stories, isLoading, error, hasMore, page, fetchMoreData, handleDelete, sort, setSort } =
    useStories();

  if (error) return (<div>Error: {error.message}</div>);
  //Only show loading screen if it's the first page
  if (isLoading && page===1) return (<LoadingScreen/>);

 


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
          <StoryList
            stories={stories}
            isLoading={isLoading}
            hasMore={hasMore}
            fetchMoreData={fetchMoreData}
            currentUserId={null}
            handleDelete={handleDelete}
            sort={sort}
            setSort={setSort}
          />
        </div>
      </main>
    </>
  );
};

export default AllUserStories;
