import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  const [character1, setCharacter1] = useState("");
  const [character2, setCharacter2] = useState("");
  const [response, setResponse] = useState("");
  const [characterError, setCharacterError] = useState<string | null>(null); // Define characterError state

  const gptQuery = api.gpt.getGPT3Response.useQuery(
    {
      character1,
      character2,
    },
    { enabled: false }
  );

  const getFilteredParagraphs = (text: string) => {
    return text.split("\n").filter((paragraph) => paragraph.trim() !== "");
  };

  const filteredParagraphs = getFilteredParagraphs(response || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (character1.length < 1 || character2.length < 1) {
      setCharacterError("Character names must not be blank."); // Update characterError state
      return;
    }
    if (character1.length > 30 || character2.length > 30) {
      setCharacterError("Character names must not exceed 30 characters."); // Update characterError state
      return;
    }
    setCharacterError(null); // Clear characterError state
    setResponse("Loading...");
    try {
      await gptQuery.refetch();
    } catch (error: unknown) {
      setResponse(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  useEffect(() => {
    if (gptQuery.data) {
      console.log(gptQuery.data);
      setResponse(gptQuery.data || "No response received from API.");
    }
  }, [gptQuery.data]);

  return (
    <>
      <Head>
        <title>AI Fight Pits</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex max-w-full flex-col items-center justify-center gap-12 px-4 py-16 sm:max-w-2xl ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            AI <span className="text-[hsl(280,100%,70%)]">Fight</span> Pits
          </h1>
          <div className="flex max-w-2xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">
              Unleash the Ultimate Showdown
            </h3>
            <div className="text-lg">
              Input the names of two characters and ignite an epic battle as our
              AI narrates their clash in vivid detail!
            </div>
          </div>
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
          {filteredParagraphs.length > 0 && (
            <div className="flex max-w-3xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              {filteredParagraphs.map((paragraph, i) => (
                <p key={i} className="text-left text-2xl text-white">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
