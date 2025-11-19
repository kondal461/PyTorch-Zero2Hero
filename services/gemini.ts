import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize API Key from environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_TUTORIAL = 'gemini-2.5-flash';
const MODEL_CHAT = 'gemini-2.5-flash';

export const generateTutorialContent = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const systemInstruction = `
You are a world-class PyTorch instructor designed to teach students from basics to expert level.
Your output must be strictly formatted in Markdown.
1. Use clear headings (#, ##).
2. Use code blocks (\`\`\`python ... \`\`\`) for all code.
3. Use LaTeX for mathematical equations. Wrap inline math in single $ (e.g., $E=mc^2$) and block math in double $$ (e.g., $$E=mc^2$$).
4. Keep explanations concise but deep.
5. Always include a "Key Takeaway" section at the end.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TUTORIAL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3, // Low temperature for factual technical content
      }
    });
    return response.text || "No content generated.";
  } catch (error) {
    console.error("Error generating tutorial:", error);
    return "## Error\nFailed to generate content. Please check your API key or try again later.";
  }
};

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: MODEL_CHAT,
    config: {
      systemInstruction: "You are a helpful PyTorch teaching assistant. Answer questions briefly and provide code snippets where relevant. Use LaTeX for math ($...$) where needed. Assume the user is currently learning from a tutorial.",
    }
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  return chat.sendMessageStream({ message });
};