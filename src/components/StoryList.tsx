import { useEffect, useState } from "react";
import Link from "next/link";
import type { Story, StoryListProps } from "~/types/types";
import { useStories } from "~/hooks/useStories";
import InfiniteScroll from "react-infinite-scroll-component";
import StoryFormatter from "./StoryFormatter";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";
import LoadingSpinner from "./LoadingSpinner";

const StoryList: React.FC<StoryListProps> = ({ currentUserId }) => {
  const router = useRouter();
  const userid =
    typeof router.query.userid === "string" ? router.query.userid : undefined;
  const { stories, isLoading, hasMore, fetchMoreData } =
    useStories(userid);

  const [localStories, setLocalStories] = useState<Story[]>(stories);
  const deleteFightMutation = api.fight.delete.useMutation();

  useEffect(() => {
    setLocalStories(stories);
  }, [stories]);

  const handleDelete = (id: number) => {
    deleteFightMutation.mutate(id, {
      onSuccess: () => {
        setLocalStories(localStories.filter((story) => story.id !== id));
      },
    });
  };

  return (
    <InfiniteScroll
      dataLength={localStories.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        isLoading && 
        <LoadingSpinner />
      }
      endMessage={
        <p className="mt-11 text-center text-xl text-white">
          <b>
            Yay! You have seen it all!{" "}
            <Link href={`/`}>
              <br />
              <u>Go write another story.</u>
            </Link>
          </b>
        </p>
      }
    >
      {localStories.length > 0
        ? localStories.map((story: Story, index: number) => (
            <div key={index} className="story-container mb-4">
              <StoryFormatter
                text={story.fightLog}
                fighter1Name={story.fighter1Name || ""}
                fighter2Name={story.fighter2Name || ""}
              />
              {story?.createdBy.id === currentUserId && (
                <>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                  >
                    Delete
                  </button>{" "}
                </>
              )}
              <Link
                href={`/stories/${story?.id}`}
                className="mt-2 inline-block rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Link to Story Page
              </Link>
            </div>
          ))
        : !isLoading && (
            <p className="text-left text-4xl text-white">No stories found</p>
          )}
    </InfiniteScroll>
  );
};

export default StoryList;
