// src/components/CharacterForm.tsx
import React, { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import type { Response } from '~/types/types';
import { TRPCClientError } from '@trpc/client';

interface FormProps {
  setResponse: React.Dispatch<React.SetStateAction<Response | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const CharacterForm: React.FC<FormProps> = ({ setResponse, setIsLoading, setError }) => {
  const [character1, setCharacter1] = useState<string>("");
  const [character2, setCharacter2] = useState<string>("");
  const [characterError, setCharacterError] = useState<string | null>(null);

  const createFight = api.fight.create.useMutation({
    retry: 0, // disable retries
  });
  const { data: sessionData } = useSession();

  const gptQuery = api.gpt.getGPT3Response.useQuery(
    {
      character1,
      character2,
    },
    {
      enabled: false,
      onSuccess: (newFight) => {
        setError("");
        if (!newFight || newFight.length < 200) {
          setError("Fighters not permitted. Try different fighters.");
          console.log("Fighters not permitted. Try different fighters.");
          return;
        }
      
        if (sessionData?.user) {
          createFight.mutate({
            fightLog: JSON.stringify(newFight),
            fighter1Name: character1,
            fighter2Name: character2,
          }, {
            onSuccess: (createdFight) => {
              setResponse({
                story: newFight,
                fighter1Name: character1,
                fighter2Name: character2,
                likeCount: 0, // default value
                storyId: createdFight.id, // use the id from the created fight
                hasUserLiked: false, // default value
              });
            },
            onError: (error) => {
              setError(error instanceof Error ? error.message : "An unknown error occurred.");
            }
          });
        } else {
          console.log("No user logged in, not posting fight to database.");
        }
      },
      onError: (error) => {
        // Handle the error from gpt.getGPT3Response here
        setError(error.message);
      },
    }
  );

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
      setIsLoading(true);
      try {
        await gptQuery.refetch();
      } catch (error: unknown) {
        if (error instanceof TRPCClientError) {
          setCharacterError(error.message);
        } else {
          setCharacterError("An unknown error occurred.");
        }
      }
      setIsLoading(false);
    })();
  };

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