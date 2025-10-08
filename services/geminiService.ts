
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Task, JournalEntry, ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `You are 'Aurora', a friendly and supportive companion in a self-care app. Your goal is to be a warm, encouraging friend. Avoid clinical, diagnostic, or medical terms. Do not use words like 'mental health', 'therapy', 'disorder', 'symptoms'. Instead, talk about feelings, personal growth, self-care, and finding joy in small things. Be conversational, empathetic, and use positive language. You have access to the user's recent activity; use it to provide personalized encouragement. For example, if they've been gardening, you could say 'I see you've been spending time with your plants! That sounds so calming.' Keep your responses concise and uplifting. When asked to suggest tasks, you must only respond with a JSON object that follows this schema: { "suggestions": ["task 1", "task 2", "task 3"] }. Do not include any other text or markdown formatting in that specific response.`;

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAI = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const createChatSession = (): Chat => {
    const aiInstance = getAI();
    return aiInstance.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });
}

const generateActivityContext = (tasks: Task[], journalEntries: JournalEntry[]): string => {
  let context = "Here is a summary of the user's recent activity:\n";

  const completedTasks = tasks.filter(t => t.completed);
  if (completedTasks.length > 0) {
    context += `- Today, they completed: ${completedTasks.map(t => t.text).join(', ')}.\n`;
  } else {
    context += "- They haven't completed any tasks today.\n";
  }

  if (journalEntries.length > 0) {
    const latestEntry = journalEntries[0];
    context += `- Their latest journal entry is titled: "${latestEntry.title}".\n`;
  }

  return context;
};


export const getChatbotResponse = async (
  history: ChatMessage[],
  newMessage: string,
  tasks: Task[],
  journalEntries: JournalEntry[]
): Promise<string> => {
  try {
    if (!chat) {
        chat = createChatSession();
    }
    const activityContext = generateActivityContext(tasks, journalEntries);
    const fullMessage = `${activityContext}\n\nUser: ${newMessage}`;

    const response = await chat.sendMessage({ message: fullMessage });
    
    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return "I'm having a little trouble connecting right now. Let's try again in a moment.";
  }
};

export const getTaskSuggestions = async (): Promise<string[]> => {
    try {
        const aiInstance = getAI();
        const response = await aiInstance.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Suggest three simple and uplifting self-care activities for today.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.suggestions || [];
    } catch (error) {
        console.error("Error getting task suggestions:", error);
        return [];
    }
}
