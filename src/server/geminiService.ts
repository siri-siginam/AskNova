import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
      return null;
    }

    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  return genAIClient;
}

export async function generateGroundedAnswer(
  userQuery: string,
  categoryGuess?: string,
  suggestedFaqs?: Array<{ question: string; answer: string }>
): Promise<string> {
  const ai = getGenAI();

  let contextPrompt = `Current User Question:\n${userQuery}\n\n`;

  if (categoryGuess) {
    contextPrompt += `Detected Topic: ${categoryGuess}\n\n`;
  }

  if (suggestedFaqs && suggestedFaqs.length > 0) {
    contextPrompt += `Relevant FAQ References (use only if helpful):\n\n`;
    suggestedFaqs.forEach((faq, index) => {
      contextPrompt += `FAQ ${index + 1}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}\n\n`;
    });
  }

  contextPrompt += `If the FAQs do not answer the user's question, ignore them and answer using your own knowledge.`;

  const systemInstruction = `
You are Ask Nova, an advanced AI assistant.

Your mission is to answer questions accurately from any domain.

Rules:
1. If the provided FAQ fully answers the user's question, use it.
2. If the FAQ does not answer the question, answer using your own knowledge.
3. Never invent or modify FAQ answers.
4. If you're uncertain, say so honestly.
5. Format answers using Markdown.
6. Use headings, bullet points, and tables when appropriate.
7. For programming questions, provide complete working code.
8. For mathematics, explain the solution step by step.
9. Always answer the user's actual question directly.
10. Be concise for simple questions and detailed for complex ones.
`;

  if (ai) {
    // Try primary and fallback models in order
    const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contextPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text?.trim()) {
          return response.text.trim();
        }
      } catch (error: any) {
        console.warn(`Gemini model ${modelName} error:`, error?.message || error);
        // Continue to try next fallback model
      }
    }
  }

  // Graceful fallback if API key is missing, quota is reached, or all AI models fail
  if (suggestedFaqs && suggestedFaqs.length > 0) {
    return `Based on our knowledge base, here is the relevant answer:\n\n### ${suggestedFaqs[0].question}\n\n${suggestedFaqs[0].answer}`;
  }

  return "I'm currently unable to connect to the live AI service due to high demand. Please try asking a common question from our FAQ or rephrase your query!";
}
