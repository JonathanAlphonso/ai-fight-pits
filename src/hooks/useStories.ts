import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import type { Story } from "~/types/types";

export const useStories = (userid?: string, initialPage = 1, initialSort = 'newest') => {
  const [stories, setStories] = useState<Story[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [sort, setSort] = useState(initialSort);
  const {
    data: fetchedStories,
    isLoading,
    error,
  } = userid
    ? // If a user is specified, fetch their stories
      api.fight.getAllSummariesByUser.useQuery({ userid, page, sort }, { enabled: !!userid })
    : // If no user ID is provided in the url, fetch all stories
      api.fight.getAllSummaries.useQuery({ page, sort });
  console.log("useStories hook has loaded!");
  console.log("current page is: ", page);

  const deleteFightMutation = api.fight.delete.useMutation();

  const handleDelete = (id: number) => {
    deleteFightMutation.mutate(id, {
      onSuccess: () => {
        // Remove the deleted story from the stories state
        setStories((prevStories) => prevStories.filter((story) => story.id !== id));
      },
    });
  };

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
        // If the page is 1, replace the existing stories with the new ones
        // Otherwise, append the new stories to the existing ones
        setStories((prevStories) => page === 1 ? updatedStories : [
          // Spread the existing stories
          ...prevStories,

          // Add the new stories from updatedStories, but only if they don't already exist in prevStories
          ...updatedStories
        ]);
      }
    }
  }, [fetchedStories, isLoading, page, sort]); // Add page and sort as dependencies

  useEffect(() => {
    // Reset page to 1 when sort order changes
    setPage(1);
    setHasMore(true);
  }, [sort]);

  const fetchMoreData = () => {
    setPage(page + 1);
  };

  return { stories, isLoading, error, hasMore, page, fetchMoreData, setSort, sort, handleDelete };
};