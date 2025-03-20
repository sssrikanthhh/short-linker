"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { ApiResponse, UrlSafetyCheck } from "@/lib/types";
import { GOOGLE_GEMINI_API_KEY } from "@/lib/constants";
import { urlSchema } from "@/lib/schemas";

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);

export async function checkUrlSafety(
  url: string,
): Promise<ApiResponse<UrlSafetyCheck>> {
  try {
    const validedUrl = urlSchema.pick({ url: true }).safeParse({ url });
    if (!validedUrl.success) {
      return {
        success: false,
        error: "Invalid URL.",
      };
    }

    if (!GOOGLE_GEMINI_API_KEY) {
      return {
        success: true,
        data: {
          isSafe: true,
          flagged: false,
          reason: null,
          category: "unknown",
          confidence: 0,
        },
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this URL for safety concerns: "${url}"
    
    Consider the following aspects:
    1. Is it a known phishing site?
    2. Does it contain malware or suspicious redirects?
    3. Is it associated with scams or fraud?
    4. Does it contain inappropriate content (adult, violence, etc.)?
    5. Is the domain suspicious or newly registered?
    
    Respond in JSON format with the following structure:
    {
      "isSafe": boolean,
      "flagged": boolean,
      "reason": string or null,
      "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
      "confidence": number between 0 and 1
    }
    
    Only respond with the JSON object, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response.");
    }

    const jsonResponse = JSON.parse(jsonMatch[0]) as UrlSafetyCheck;

    return {
      success: true,
      data: jsonResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to check URL safety.",
    };
  }
}
