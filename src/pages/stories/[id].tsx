import type { NextPage } from "next";
import Head from "next/head";
import StoryFormatter from "~/components/StoryFormatter";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { ssgHelper } from '~/server/api/ssgHelper';


const SingleStoryPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const { storyData:story } = props;
  const isLoading = false;

  return (
    <>
      <Head>
        <title>{`${story?.fighter1Name || "Unknown"} vs ${
          story?.fighter2Name || "Unknown"
        }`}</title>
        <meta name="description" content="Fight story" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] sm:min-h-screen">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-4 sm:max-w-2xl sm:gap-12 sm:px-4 sm:py-16">
          {isLoading ? (
            <div className="text-lg text-white sm:text-2xl">Loading...</div>
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
                      `Created ${formatDistanceToNow(
                        new Date(story.time)
                      )} ago`}
                  </p>
                </div>
              </div>

              <StoryFormatter
                text={story?.fightLog || ""}
                fighter1Name={story?.fighter1Name || ""}
                fighter2Name={story?.fighter2Name || ""}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export const getStaticPaths = async () => {
  const ssg = ssgHelper();
  const fights = await ssg.fight.getAll.fetch();

  const paths = fights.map((fight) => ({
    params: { id: fight.id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) {
  const ssg = ssgHelper();
  const id = context.params?.id as string;

  if (isNaN(Number(id))) {
    throw new Error(`Invalid id: ${id}`);
  }

  let storyData = await ssg.fight.getOne.fetch(Number(id));

  if (storyData.time) {
    storyData = {
      ...storyData,
      // @ts-expect-error: bullshit can't serialize date but also doesn't want to convert to string
      time: (storyData.time as unknown as Date).toISOString(),
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
      storyData,
    },
    revalidate: 60,
  };
}

export default SingleStoryPage;