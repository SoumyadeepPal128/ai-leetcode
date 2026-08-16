import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generateProblemFromPrompt } from "../utils/gemini.util.js";
import { runCode } from "../utils/piston.util.js";
import { Problem } from "../models/problem.model.js";

const generateProblem = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  // Step 1: ask Gemini for a problem + reference solution + sample inputs
  const generated = await generateProblemFromPrompt(prompt);
  if (!generated) {
    throw new ApiError(502, "Problem could not be generated");
  }

  // Step 2: NEVER trust Gemini's claimed behavior - actually RUN (compile +
  // execute, for C++) the reference solution against each sample input,
  // and use the real output as the verified expected output.
  const testCases = [];
  
  for (const input of generated.sampleInputs) {
  let result = await runCode("cpp", generated.referenceSolution, input);

  // Retry once on timeout - could be transient resource contention,
  // not necessarily a real problem with the code.
  if (result.timedOut) {
    console.warn(`Timed out on input "${input}", retrying once...`);
    result = await runCode("cpp", generated.referenceSolution, input);
  }

  const { stdout, stderr, timedOut } = result;

  if (timedOut || stderr) {
    console.warn(`Reference solution failed on input "${input}":`, stderr || "(timed out twice)");
    continue;
  }

  testCases.push({ input, expectedOutput: stdout });
}

  if (testCases.length === 0) {
    throw new ApiError(
      502,
      "Reference solution failed on all generated inputs - try a different prompt"
    );
  }

  // Step 3: now that we have VERIFIED test cases, save the problem
  const problem = await Problem.create({
    title: generated.title,
    description: generated.description,
    prompt,
    referenceSolution: generated.referenceSolution,
    testCases,
    // createdBy: req.user?._id,  // add once auth is wired in
  });

  return res
    .status(201)
    .json(new ApiResponse(201, problem, "Problem generated successfully"));
});

export { generateProblem };