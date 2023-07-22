import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";

type CreateChatCompletionResponse = {
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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log("OpenAI API key: ", process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);

export const gptRouter = createTRPCRouter({
  getGPT3Response: publicProcedure
    .input(z.object({ character1: z.string(), character2: z.string() }))
    .query(async ({ input }) => {
      const prompt = `Please vividly describe a single round fight between the characters ${input.character1} and ${input.character2}. Your description should be exciting and detailed, focusing on the specific skills and attributes of the fighters. At the conclusion of the fight, clearly state the winner and provide a compelling explanation based on the implied capabilities of the two opponents.
        Remember to focus on the fight itself and provide a thrilling narrative that brings the action to life. Avoid introducing your role in the response and ensure that the description remains concise and within the specified word limit of 150 words.`;

      try {
        const res = await Promise.race([
          openai
            .createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 400,
            })
            .then((response) => response.data as CreateChatCompletionResponse),
          new Promise((_, reject) =>
            setTimeout(reject, 10000, "Timeout Error")
          ),
        ]);

        if (res && (res as CreateChatCompletionResponse).choices) {
          const { choices } = res as CreateChatCompletionResponse;
          if (choices?.[0]?.message) {
            return choices[0].message.content;
          } else {
            throw new Error("No response from GPT-3");
          }
        } else {
          throw new Error(`Error: ${res ? res.toString() : "res is falsy"}`);
        }
      } catch (error) {
        throw new Error(
          `Error: ${error ? error.toString() : "error is falsy"}`
        );
      }
    }),
});
