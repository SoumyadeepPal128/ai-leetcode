import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const executeCode = asyncHandler(async (req, res) => {
  const { problemId, language, code } = req.body;

  if (problemId !== "sample-1") {
    throw new ApiError(404, `No problem found with id: ${problemId}`);
  }

  const fakeVerdict = {
    allPassed: true,
    results: [
      { input: "2 3", expectedOutput: "5", actualOutput: "5", passed: true },
    ],
  };

  return res
    .status(200)
    .json(new ApiResponse(200, fakeVerdict, "Code executed (fake result — Piston not wired up yet)"));
});

export { executeCode };