// StoryList.tsx
import { api } from "~/utils/api";
import StoryFormatter from "./StoryFormatter";
import { useEffect, useState } from "react";
import type { Story, StoryListProps} from "~/types/types";

const StoryList: React.FC<StoryListProps> = ({
  stories,
  isLoading,
  currentUserId,
}) => {
  const [localStories, setLocalStories] = useState<Story[]>([]);
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
    <>
      {isLoading ? (
        <p className="text-left text-4xl text-white">Loading...</p>
      ) : localStories?.length ?? 0 > 0 ? (
        localStories.map((story: Story, index: number) => (
          <div key={index} className="story-container">
            <StoryFormatter
              text={story.fightLog}
              fighter1Name={story.fighter1Name || ""}
              fighter2Name={story.fighter2Name || ""}
            />
            {story?.createdBy.id === currentUserId && (
              <button
                onClick={() => handleDelete(story.id)}
                className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-left text-4xl text-white">No stories found</p>
      )}
    </>
  );
};

export default StoryList;
