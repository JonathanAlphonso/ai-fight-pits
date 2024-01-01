// src/pages/users/profile.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function ProfilePage() {
  const [name, setName] = useState("Loading...");
  const updateNameMutation = api.users.updateName.useMutation();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (session) {
      if (name !== session.user.name) {
        try {
          await updateNameMutation.mutateAsync({ name });
          alert("Username has been changed successfully!");
        } catch (error) {
          if (error instanceof Error) {
            // Display a user-friendly error message
            alert("Error: " + error.message);
          }
        }
      } else {
        alert("New username is the same as the current username.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>User Profile</title>
        <meta name="description" content="User Profile Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex max-w-full flex-col items-center justify-center gap-12 px-4 py-16 sm:max-w-2xl ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            User <span className="text-[hsl(280,100%,70%)]">Profile</span>
          </h1>
          <form
            onSubmit={(e) => {
              handleSubmit(e).catch((error) => {
                console.error("Error in handleSubmit:", error);
              });
            }}
            className="flex max-w-2xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          >
            <label className="text-2xl font-bold">
              Display Name: &nbsp;
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={session?.user?.name || "Enter name"}
                required
                className="mt-2 w-full flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 sm:max-w-xs"
              />
            </label>
            <button
              type="submit"
              className="mt-12 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Update
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
