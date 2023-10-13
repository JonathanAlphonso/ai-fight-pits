import React from "react";

interface StoryFormatterProps {
  text: string;
}

const StoryFormatter: React.FC<StoryFormatterProps> = ({ text }) => {
  // Remove quotes if they exist at the start and end of the string
  const trimmedText =
    text[0] === '"' && text[text.length - 1] === '"' ? text.slice(1, -1) : text;

  // Interpret \n as actual newlines
  const interpretedText = trimmedText.replace(/\\n/g, "\n");

  const getFilteredParagraphs = (text: string) => {
    return text.split("\n").filter((paragraph) => paragraph.trim() !== "");
  };

  const filteredParagraphs = getFilteredParagraphs(interpretedText || "");

  return (
    <div className="flex max-w-3xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
      {filteredParagraphs.map((paragraph, i) => (
        <p key={i} className="text-left text-2xl text-white">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default StoryFormatter;
