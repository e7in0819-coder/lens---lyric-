import { GoogleGenAI, Type } from "@google/genai";
import { CaptionResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are a visionary artistic director and poet. Your task is to analyze images or videos to understand their deeper meaning, mood, underlying concepts, and emotional resonance. 
Do not just describe the visual elements literally. Instead, interpret the "soul" of the media.

Based on this analysis, generate two captions:
1. An English caption: Poetic, evocative, or witty, suitable for high-end social media (Instagram/Pinterest).
2. A Chinese caption: Elegant, using appropriate idioms or poetic phrasing (Chengyu or modern poetry style) that matches the English tone.

You must also provide your "reasoning" - a brief explanation of how you connected the visual elements to the abstract concepts.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reasoning: {
      type: Type.STRING,
      description: "The internal thought process connecting visual elements to abstract concepts.",
    },
    englishCaption: {
      type: Type.STRING,
      description: "A creative, engaging caption in English.",
    },
    chineseCaption: {
      type: Type.STRING,
      description: "A creative, engaging caption in Chinese.",
    },
  },
  required: ["reasoning", "englishCaption", "chineseCaption"],
};

export const generateCaptions = async (
  base64Data: string,
  mimeType: string
): Promise<CaptionResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing from environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Using gemini-2.5-flash as it supports multimodal input and thinking config
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this media and provide the requested captions based on the schema.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        // Enabling thinking to enhance the "basic human thinking" aspect requested
        thinkingConfig: {
            thinkingBudget: 2048 
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const result = JSON.parse(text) as CaptionResponse;
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};