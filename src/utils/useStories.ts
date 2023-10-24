// src/hooks/useStories.ts
import { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import type { Story } from '../types/types';

export const useStories = (userid?: string) => {
  const [stories, setStories] = useState<Story[]>([]);
  const { data: fetchedStories, isLoading, error } = userid 
    ? api.fight.getAllByUser.useQuery(
        { userid },
        { enabled: !!userid }
      )
    : api.fight.getAll.useQuery();

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
      setStories(updatedStories);
    }
  }, [fetchedStories, isLoading]);

  return { stories, isLoading, error };
};