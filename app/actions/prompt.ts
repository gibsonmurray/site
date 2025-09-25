"use server"

import { openai } from "@ai-sdk/openai"
import { streamText, UIMessage, convertToModelMessages, tool } from "ai"
import { z } from "zod/v4"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export const prompt = async (messages: UIMessage[]) => {
    const result = streamText({
        model: openai("gpt-5-mini"),
        messages: convertToModelMessages(messages),
        tools: {
            customFormat: tool({
                description:
                    "Respond with a JSON object containing 'answer' and 'style'",
                inputSchema: z.object({
                    question: z.string(),
                    style: z.string(),
                }),
                execute: async ({ question, style }) => ({
                    answer: `This is the answer to "${question}" in style "${style}"`,
                    style,
                }),
            }),
        },
    })

    return result.toUIMessageStreamResponse()
}
