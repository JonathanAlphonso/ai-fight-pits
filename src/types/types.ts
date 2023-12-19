export type User = {
  name: string;
  email: string;
  image: string;
  id: string;
};

export type Story = {
  fighter1Name: string | null;
  fighter2Name: string | null;
  createdBy: User;
  id: number;
  fightLog: string;
  fighter1Id: number;
  fighter2Id: number;
  //winnerId: number | null;
  fightWinner: string | null;
  time: string | Date; // Adjusted to accept both Date and string
  createdById: string;
};

// export type DetailedStory = {
//   fighter1Name: string | null;
//   fighter2Name: string | null;
//   createdBy: User;
//   id: number;
//   fightLog: string;
//   fighter1Id: number;
//   fighter2Id: number;
//   winnerId: number | null;
//   time: Date;
//   createdById: string;
// };

export type StoryListProps = {
  stories: Story[];
  isLoading: boolean;
  currentUserId: string | null;
};

export type StoryFormatterProps = {
  text: string;
  fighter1Name: string;
  fighter2Name: string;
};

export type UserStoriesProps = {
  userid: string;
};

export type Response = {
  story: string;
  fighter1Name: string;
  fighter2Name: string;
};

export type CreateChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }
  ];
};