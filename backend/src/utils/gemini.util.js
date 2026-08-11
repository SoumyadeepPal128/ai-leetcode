import { GoogleGenAI } from "@google/genai";

// Reads GEMINI_API_KEY from process.env automatically.
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// This describes the EXACT shape we want the JSON response to have.
// Gemini's structured output feature guarantees the response matches
// this schema - no more "hope the model didn't add extra text" parsing.
const PROBLEM_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "Short problem title" },
    description: {
      type: "string",
      description: "Full problem statement in markdown, including constraints",
    },
    referenceSolution: {
      type: "string",
      description:
        "A complete, runnable Python script that reads input from stdin and prints output to stdout, solving the problem",
    },
    sampleInputs: {
      type: "array",
      items: { type: "string" },
      description:
        "At least 5 sample stdin inputs, covering typical and edge cases",
    },
  },
  required: ["title", "description", "referenceSolution", "sampleInputs"],
};

const SYSTEM_INSTRUCTIONS = `You are a problem-setter for a coding practice platform, similar to LeetCode.
Given a short description of a coding problem, generate a complete, well-specified
programming problem with a correct Python reference solution and varied sample inputs.
The referenceSolution must read from stdin and print to stdout - it will be executed directly.
Do NOT include expected outputs yourself - those are computed separately by running your solution.`;

/**
 * Turns a rough prompt like "the two sum problem" into a structured
 * problem object.
 * @param {string} userPrompt
 * @returns {Promise<object>} matches PROBLEM_SCHEMA above
 */
export async function generateProblemFromPrompt(userPrompt) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: `${SYSTEM_INSTRUCTIONS}\n\nUser's request: ${userPrompt}`,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: PROBLEM_SCHEMA,
    },
  });

  // Thanks to response_format, this is GUARANTEED valid JSON matching
  // our schema - no try/catch-and-hope needed here.
  return JSON.parse(interaction.output_text);
}