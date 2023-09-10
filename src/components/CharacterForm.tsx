import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

interface FormProps {
  setResponse: React.Dispatch<React.SetStateAction<string>>;
}

const CharacterForm: React.FC<FormProps> = ({ setResponse }) => {
  const [character1, setCharacter1] = useState<string>("");
  const [character2, setCharacter2] = useState<string>("");
  const [characterError, setCharacterError] = useState<string | null>(null);

  const gptQuery = api.gpt.getGPT3Response.useQuery(
    {
      character1,
      character2,
    },
    { enabled: false }
  );

  const createFight = api.fight.create.useMutation();
  const { data: sessionData } = useSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      if (character1.length < 1 || character2.length < 1) {
        setCharacterError("Character names must be at least 1 character.");
        return;
      }
      if (character1.length > 50 || character2.length > 50) {
        setCharacterError("Character names must not exceed 50 characters.");
        return;
      }
      setCharacterError(null);
      setResponse("Loading...");
      try {
        await gptQuery.refetch();
        console.log(gptQuery.data);
      } catch (error: unknown) {
        setResponse(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      }
    })();
  };

  useEffect(() => {
    if (gptQuery.data) {
      console.log(`Console logged date in useEffect: ${gptQuery.data}`);
      setResponse(gptQuery.data || "No response received from API.");
      if (sessionData?.user) {
        const postData = async () => {
          await createFight.mutate({
            fightLog: await JSON.stringify(gptQuery.data),
            fighter1Id: 1,
            fighter2Id: 2,
          });
        };
        postData();
      } else {
        console.log("No user logged in, not posting fight to database.");
      }
    }
  }, [gptQuery.data, setResponse]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-cols-1 sm:flex-cols-2 flex gap-4 md:gap-8">
        <input
          type="text"
          value={character1}
          onChange={(e) => setCharacter1(e.target.value)}
          placeholder="Enter Character 1"
          className="w-full flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 sm:max-w-xs"
        />
        <input
          type="text"
          value={character2}
          onChange={(e) => setCharacter2(e.target.value)}
          placeholder="Enter Character 2"
          className="w-full flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 sm:max-w-xs"
        />
      </div>
      {characterError && (
        <div className="mt-2 flex justify-center text-red-500">
          {characterError}
        </div>
      )}
      <div className="mt-12 flex justify-center gap-4 md:gap-8">
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
