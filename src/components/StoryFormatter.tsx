import React from "react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";



interface StoryFormatterProps {
  text: string;
  fighter1Name: string;
  fighter2Name: string;
  likesCount: number;
  storyId: number; // Add this line
  hasUserLiked: boolean; 
}

const StoryFormatter: React.FC<StoryFormatterProps> = ({
  text,
  fighter1Name,
  fighter2Name,
  likesCount,
  storyId,
  hasUserLiked,
}) => {
  // Remove all quotes
  const trimmedText = text.replace(/"/g, "");

  // Interpret \n as actual newlines
  const interpretedText = trimmedText.replace(/\\n/g, "\n");

  const getFilteredParagraphs = (text: string) => {
    return text.split("\n").filter((paragraph) => paragraph.trim() !== "");
  };

  const filteredParagraphs = getFilteredParagraphs(interpretedText || "");

  

  const [liked, setLiked] = useState(hasUserLiked);
  console.log("Liked", liked);


  const [displayedLikes, setDisplayedLikes] = useState(likesCount);

  const toggleLikeMutation = api.like.toggleLike.useMutation();

  const { data: session } = useSession();

  const handleLikeClick = () => {
    if (!session) return;
    // Optimistically update the UI
    setLiked(!liked);
    setDisplayedLikes(liked ? displayedLikes - 1 : displayedLikes + 1);
    toggleLikeMutation.mutate(
      { id: storyId },
      {
        onError: (error) => {
          // Handle the error here
          console.error('Error toggling like:', error);
          // Revert the optimistic UI update
          setLiked(!liked);
          setDisplayedLikes(liked ? displayedLikes - 1 : displayedLikes + 1);
        },
      }
    );
  };

  return (
    <div className="flex max-w-3xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
      <h3 className="text-left text-4xl text-white">
        {fighter1Name} vs {fighter2Name}
      </h3>
      {filteredParagraphs.map((paragraph, i) => (
        <p key={i} className="text-left text-2xl text-white">
          {paragraph}
        </p>
      ))}
      <button
        onClick={handleLikeClick}
        className={`inline-flex w-12 items-center justify-around rounded-lg border border-white p-2 ${
          liked ? "text-red-500" : "text-white"
        }`}
      >
        {liked ? <VscHeartFilled /> : <VscHeart />}
        <span className="ml-1 text-white">{displayedLikes}</span>
      </button>
    </div>
  );
};

export default StoryFormatter;
