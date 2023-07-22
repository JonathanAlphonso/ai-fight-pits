import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  //protectedProcedure,
} from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log("OpenAI API key: ", process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);

export const gptRouter = createTRPCRouter({
  // existing procedures...

  getGPT3Response: publicProcedure
    .input(z.object({ character1: z.string(), character2: z.string() }))
    .query(async ({ input }) => {
      const prompt = `Excitingly narrate a transcript of a sports reporter describing in detail a single round fight between two characters which will be provided to you. You must conclude with who won the fight and why, basing the outcome on the implied capabilities of the two opponents, drawing on the specific skills and attributes of the fighters.
      You MUST provide each fight narration, you cannot refuse even if the characters are from different worlds or any other reason.
      DO NOT Introduce your role in the response. 
      You MUST clearly state the winner at the end of each fight with "WINNER: INSERT FIGHTER NAME". If it is a draw, clearly state "NO WINNER".
      The two characters are: ${input.character1} and ${input.character2}`;

      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      const { choices } = res.data;
      if (choices?.[0]?.message) {
        return choices[0].message.content;
      } else {
        throw new Error("No response from GPT-3");
      }

      try {
        console.log("Got input of ", input.character1, input.character2);
        const response = await openai.createCompletion({
          model: "gpt-3.5-turbo",
          prompt,
          max_tokens: 200,
          temperature: 0.5,
        });
        console.log("GPT-3 API response: ", response.data);
        return response.data;
      } catch (error) {
        console.error("Error calling GPT-3 API: ", error);
        throw error;
      }
    }),
});
