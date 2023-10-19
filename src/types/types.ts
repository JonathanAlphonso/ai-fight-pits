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
  winnerId: number | null;
  time: Date;
  createdById: string; // Change this from string to User
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

export type Response = {
  story: string;
  fighter1Name: string;
  fighter2Name: string;
};