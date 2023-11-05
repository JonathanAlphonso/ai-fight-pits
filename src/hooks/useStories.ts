import { useState, useEffect, useCallback } from "react";
import { api } from "~/utils/api";
import type { Story } from "~/types/types";

export const useStories = (userid?: string, initialPage = 1) => {
  const [state, setState] = useState<{
    stories: Story[];
    hasMore: boolean;
    page: number;
  }>({
    stories: [],
    hasMore: true,
    page: initialPage,
  });

  const query = userid 
    ? api.fight.getAllByUser.useQuery(
        { userid, page: state.page },
        { enabled: !!userid }
      )
    : api.fight.getAll.useQuery({ page: state.page });

  const { data: fetchedStories, isLoading, error, refetch } = query;

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
      setState(prevState => ({
        ...prevState,
        stories: [...prevState.stories, ...updatedStories],
        hasMore: fetchedStories.length !== 0,
      }));
    }
  }, [fetchedStories, isLoading]);

  const fetchMoreData = useCallback(async () => {
    setState(prevState => ({ ...prevState, page: prevState.page + 1 }));
    await refetch();
    console.log('fetching more data');
  }, [refetch]);

  return { stories: state.stories, isLoading, error, hasMore: state.hasMore, fetchMoreData };
};