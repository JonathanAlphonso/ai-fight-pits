export type User = {
  name: string;
  email?: string;
  image?: string;
  id: string;
};

export type Story = {
  id: number;
  fightLog: string;
  fighter1Name: string;
  fighter2Name: string;
  createdBy: {
    id: string;
    name: string;
  };
  likeCount: number;
  hasUserLiked: boolean;
  views?: number;
  createdAt?: string;
};

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

// src/types/types.ts
export type Response = {
  story: string;
  fighter1Name: string;
  fighter2Name: string;
  likeCount: number;
  storyId: number;
  hasUserLiked: boolean;
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


export type PaginationInput = {
  page?: number;
  sort?: string;
};