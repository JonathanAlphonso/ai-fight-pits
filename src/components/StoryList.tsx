import Link from "next/link";
import type { Story, StoryListProps } from "~/types/types";
import StoryFormatter from "./StoryFormatter";
import InfiniteScroll from "react-infinite-scroll-component";
import ClipLoader from "react-spinners/ClipLoader";

type ExtendedStoryListProps = StoryListProps & {
  currentUserId: string | null;
  stories: Story[];
  isLoading: boolean;
  hasMore: boolean;
  fetchMoreData: () => void;
  setSort: (sort: string) => void;
  sort: string;
  handleDelete: (id: number) => void;
};

const StoryList: React.FC<ExtendedStoryListProps> = ({ currentUserId, stories, isLoading, hasMore, fetchMoreData, setSort, sort, handleDelete }) => {
  console.log("Stories", stories);
  const handleSortChange = (sort: string) => {
    setSort(sort);
  };

  return (
    <InfiniteScroll
      dataLength={stories.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        isLoading && (
          <div
            style={{
              overflow: "hidden",
            }}
          >
            <ClipLoader
              cssOverride={{ overflow: "hidden", height: 250, width: 250 }}
              color={"#ffffff"}
              size={250}
            />
          </div>
        )
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
      <div className="flex space-x-4 border rounded-full p-2 bg-black mb-4">
        <button 
          className={`px-4 py-2 rounded-full ${sort === 'newest' ? 'bg-[hsl(260,100%,60%)] text-white' : 'bg-[hsl(280,100%,70%)] text-black'}`} 
          onClick={() => handleSortChange("newest")}
        >
          Newest
        </button>
        <button 
          className={`px-4 py-2 rounded-full ${sort === 'mostViewed' ? 'bg-[hsl(260,100%,60%)] text-white' : 'bg-[hsl(280,100%,70%)] text-black'}`} 
          onClick={() => handleSortChange("mostViewed")}
        >
          Most Viewed
        </button>
        <button 
          className={`px-4 py-2 rounded-full ${sort === 'mostLiked' ? 'bg-[hsl(260,100%,60%)] text-white' : 'bg-[hsl(280,100%,70%)] text-black'}`} 
          onClick={() => handleSortChange("mostLiked")}
        >
          Most Liked
        </button>
      </div>
      {stories.length > 0
        ? stories.map((story: Story, index: number) => (
            <div key={index} className="story-container mb-4">
              <StoryFormatter
                text={story.fightLog}
                fighter1Name={story.fighter1Name || ""}
                fighter2Name={story.fighter2Name || ""}
                likeCount={story.likeCount}
                storyId={story.id}
                hasUserLiked={story?.hasUserLiked ?? false}
                views={story?.views ?? 0}
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
                Continue Reading
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
