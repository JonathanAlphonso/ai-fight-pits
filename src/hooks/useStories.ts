import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import type { Story } from "~/types/types";

export const useStories = (userid?: string, initialPage = 1) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const { data: fetchedStories, isLoading, error } = userid 
    ? api.fight.getAllByUser.useQuery(
        { userid, page },
        { enabled: !!userid }
      )
    : api.fight.getAll.useQuery({});

  useEffect(() => {
    if (!isLoading && fetchedStories) {
      const updatedStories = fetchedStories.map((story) => ({
        ...story,
        createdBy: {
          ...story.createdBy,
          name: story.createdBy.name || "Unknown",
          email: story.createdBy.email || "",
          image: story.createdBy.image || "",
        },
        createdById: story.createdBy.id,
      }));
      if (fetchedStories.length === 0) {
        setHasMore(false);
      } else {
        setStories(prevStories => [...prevStories, ...updatedStories]);
      }
    }
  }, [fetchedStories, isLoading]);

  const fetchMoreData = () => {
    setPage(page + 1);
  };

  return { stories, isLoading, error, hasMore, fetchMoreData };
};