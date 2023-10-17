// StoryList.tsx
import StoryFormatter from "./StoryFormatter";

type Story = {
  fightLog: string;
  fighter1Name: string | null;
  fighter2Name: string | null;
};

type StoryListProps = {
  stories: Story[];
  isLoading: boolean;
};

const StoryList: React.FC<StoryListProps> = ({ stories, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <p className="text-left text-4xl text-white">Loading...</p>
      ) : (
        stories?.length ?? 0 > 0 ? (
          stories.map((story: Story, index: number) => (
            <div key={index} className="story-container">
              <StoryFormatter 
                text={story.fightLog} 
                fighter1Name={story.fighter1Name || '' } 
                fighter2Name={story.fighter2Name || '' }
              />
            </div>
          ))
        ) : (
          <p>No stories found</p>
        )
      )}
    </>
  );
};

export default StoryList;