import { GoogleGenAI } from "@google/genai";

// Reads GEMINI_API_KEY from process.env automatically.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
        "A complete, runnable C++ script that reads input from stdin and prints output to stdout, solving the problem",
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
programming problem with a correct C++ reference solution and varied sample inputs.

REFERENCE SOLUTION REQUIREMENTS (this code will be executed directly - it must be
syntactically perfect and logically correct):
- Must read from stdin and print to stdout.
- Use consistent 4-space indentation throughout. Never mix tabs and spaces, and never
  vary indentation width within the same code block.
- Prefer simple, straightforward logic over clever or highly optimized approaches -
  simpler code has fewer opportunities for bugs.
- Before finalizing, mentally trace through your solution against EVERY sample input
  you provide, step by step, and confirm it produces the correct output. If it doesn't,
  fix the solution before responding.
- Use only C++'s standard library.

SAMPLE INPUT REQUIREMENTS:
- Provide at least 5 sample inputs.
- Cover: a typical/average case, a minimum-size edge case, a case with duplicate values
  (if relevant to the problem), a case with negative numbers or boundary values (if
  relevant), and one larger case to catch performance issues.
- Do NOT include expected outputs yourself - those are computed separately by running
  your referenceSolution.`;
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