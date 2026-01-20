
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSmartBrief = async (serviceType: string, userInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User wants a ${serviceType} service. Their raw idea: "${userInput}". 
      Please generate a professional, structured project brief. 
      Include Target Audience, Style/Tone, Core Message, and Specific Requirements.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            tone: { type: Type.STRING },
            coreMessage: { type: Type.STRING },
            requirements: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "targetAudience", "tone", "coreMessage", "requirements"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getMarketTrends = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `What are the current trending topics or styles for ${topic} in 2024? Give a concise list.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return null;
  }
};
