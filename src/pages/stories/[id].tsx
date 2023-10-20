import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import AuthShowcase from "~/components/AuthShowcase";
import { api } from "~/utils/api";
import StoryFormatter from "~/components/StoryFormatter";
import Link from "next/link";
import NavBar from "~/components/NavBar";

const StoryPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: story, isLoading } = api.fight.getOne.useQuery(Number(id));

  return (
    <>
      <NavBar />
      <Head>
        <title>
          {story?.fighter1Name} vs {story?.fighter2Name}
        </title>
        <meta name="description" content="Fight story" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex max-w-full flex-col items-center justify-center gap-12 px-4 py-16 sm:max-w-2xl ">
          {isLoading ? (
            <div className="text-2xl text-white">Loading...</div>
          ) : (
            <>
              <div className="mb-4 flex justify-start text-2xl text-white">
                <p>Story ID: {story?.id} |&nbsp;</p>
                <p>
                  Story created by:&nbsp;
                  <Link href={`/stories/users/${story?.createdBy.id ?? ""}`}>
                    <span className="cursor-pointer text-blue-500 hover:underline">
                      {story?.createdBy.name}
                    </span>
                  </Link>
                </p>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                {story?.fighter1Name} vs {story?.fighter2Name}
              </h1>
              <StoryFormatter
                text={story?.fightLog || ""}
                fighter1Name={story?.fighter1Name || ""}
                fighter2Name={story?.fighter2Name || ""}
              />
            </>
          )}
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default StoryPage;
