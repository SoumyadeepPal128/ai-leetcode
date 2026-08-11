import { ApiError } from "../utils/api-errors.js";

/**
 * POST /api/execute
 * body: { problemId, language, code }
 *
 * For now: returns a FAKE verdict so we can prove the request pipeline
 * works before wiring up real code execution via Piston.
 */
const executeCode = async (req, res) => {
  const { problemId, language, code } = req.body;

  // Simulating a "not found" error path too, so we can see ApiError
  // work for something other than validation failures.
  if (problemId !== "sample-1") {
    throw new ApiError(404, `No problem found with id: ${problemId}`);
  }

  // Fake verdict — pretend every submission passes for now.
  const fakeVerdict = {
    allPassed: true,
    results: [
      {
        input: "2 3",
        expectedOutput: "5",
        actualOutput: "5",
        passed: true,
      },
    ],
  };

  res.status(200).json({
    success: true,
    message: "Code executed (fake result — Piston not wired up yet)",
    data: fakeVerdict,
  });
};

export { executeCode };