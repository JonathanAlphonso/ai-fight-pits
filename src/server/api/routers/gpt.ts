import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import type { CreateChatCompletionResponse } from "../../../types/types";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const gptRouter = createTRPCRouter({
  getGPT3Response: publicProcedure
    .input(
      z.object({
        character1: z
          .string()
          .min(1, "Character 1 must not be blank")
          .max(30, "Character 1 must not exceed 30 characters"),
        character2: z
          .string()
          .min(1, "Character 2 must not be blank")
          .max(30, "Character 2 must not exceed 30 characters"),
      })
    )
    .query(async ({ input }) => {
      let { character1, character2 } = input;

      // 50% chance to swap character1 and character2
      if (Math.random() < 0.5) {
        [character1, character2] = [character2, character1];
      }

      const prompt = `
      Given the attributes of the fighters ${input.character1} and ${input.character2}, excitingly describe a single round fight between them. 
      Focus on their realistic and commonly known skills and attributes. 
      At the conclusion of the fight, clearly state the winner based on their demonstrated capabilities in a separate line 
      as "Winner: ${input.character1}" or "Winner: ${input.character2}" or "Winner: Draw". 
      The description should remain within a 150-word limit.`;
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
            setTimeout(reject, 99900, "Timeout Error")
          ),
        ]);

        if (res && (res as CreateChatCompletionResponse).choices) {
          const { choices } = res as CreateChatCompletionResponse;
          if (choices?.[0]?.message) {
            if (choices[0].message.content.length < 200) {
              throw new Error(
                "Fighters not permitted. Try different fighters."
              );
            }
            return choices[0].message.content;
          } else {
            throw new Error("No response from GPT-3");
          }
        }
      } catch (error) {
        throw new Error(
          `Error: ${error ? error.toString() : "error is falsy"}`
        );
      }
    }),
});
