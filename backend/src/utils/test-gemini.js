import "dotenv/config";
console.log("Key loaded:", process.env.GEMINI_API_KEY ? "yes, starts with " + process.env.GEMINI_API_KEY.slice(0, 6) : "NO KEY FOUND");
import { generateProblemFromPrompt } from "./gemini.util.js";

const result = await generateProblemFromPrompt("the classic two sum problem");
console.log(JSON.stringify(result, null, 2));