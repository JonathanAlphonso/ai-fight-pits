import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import type { Story } from "~/types/types";

export const useStories = (userid?: string, initialPage = 1) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const {
    data: fetchedStories,
    isLoading,
    error,
  } = userid
    ? // If a user is specified, fetch their stories
      api.fight.getAllByUser.useQuery({ userid, page }, { enabled: !!userid })
    : // If no user ID is provided in the url, fetch all stories
      api.fight.getAll.useQuery({ page });
  console.log("useStories hook has loaded!");
  console.log("current page is: ", page);
  useEffect(() => {
    // Only proceed if data is not being loaded and there are fetched stories
    if (!isLoading && fetchedStories) {
      // Map over fetched stories and create a new array of stories
      const updatedStories = fetchedStories.map((story) => ({
        ...story,
        createdBy: {
          ...story.createdBy,
          name: story.createdBy.name || "Unknown",
          email: story.createdBy.email || "",
          image: story.createdBy.image || "",
        },
      }));

      if (fetchedStories.length === 0) {
        setHasMore(false); /// All stories have been fetched
      } else {
        setStories((prevStories) => [
          // Spread the existing stories
          ...prevStories,
        
          // Add the new stories from updatedStories, but only if they don't already exist in prevStories
          ...updatedStories.filter(
            // For each updated story, check if it already exists in prevStories
            (updatedStory) =>
              // The 'some' method returns true if at least one element in the array satisfies the provided condition
              // In this case, the condition is that the id of the prevStory matches the id of the updatedStory
              // The '!' operator negates the result, so this condition will return true only if the updatedStory does NOT already exist in prevStories
              !prevStories.some((prevStory) => prevStory.id === updatedStory.id)
          ),
        ]);
      }
    }
  }, [fetchedStories, isLoading]);

  const fetchMoreData = () => {
    setPage(page + 1);
  };

  return { stories, isLoading, error, hasMore, page, fetchMoreData };
};
