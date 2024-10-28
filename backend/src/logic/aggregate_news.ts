import Groq from "groq-sdk";
require("dotenv").config();
import { AppError } from "../middleware/errorHandler.ts";

import { Request, Response, NextFunction } from "express";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getGroqChatCompletion = async (topic?: string) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a news generator AI helper that assists in comprehensive news generation. Follow these strict formatting rules:

      1. Respond ONLY with a valid JSON array containing news objects
      2. Each news object MUST have this exact structure:
      {
        "id": number,
        "title": string,
        "content": string
      }
        3. Maximum 8 news items
        4. Do not include any text before or after the JSON array
        5. Ensure all JSON syntax is complete and valid
        6. Always use double quotes for property names and string values
        7. Content should be comprehensive and detailed

        Example of expected format:
        [
          {
            "id": 1,
            "title": "Example News Title",
            "content": "Detailed news content here..."
          }
        ]`,
      },
      {
        role: "user",
        content: `Generate news and happenings related to: ${topic}`,
      },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 1,
    stop: null,
    stream: false,
  });
};


export const generateNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic } = req.body;
    const chatCompletion = await getGroqChatCompletion(topic);
    if (!chatCompletion.choices[0].message.content) {
      throw new AppError("We ran into a server error try again", 500);
    }

    const aiResponse = chatCompletion.choices[0]?.message?.content;
    const parsedResponse = JSON.parse(aiResponse);
    if (!Array.isArray(parsedResponse)) {
      throw new AppError("Invalid response from AI", 500);
    }
    res.status(201).json(parsedResponse);
  } catch (err) {
    next(err);
  }
};
