import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getProblemById } from "./problem.controller.js";
import { Problem } from "../models/problem.model.js";
import { runAgainstTestCases } from "../utils/piston.util.js";

const executeCode = asyncHandler(async (req, res) => {
  const { problemId, language, code } = req.body;

  const problem=await Problem.findById(problemId);

  if(!problem){
    throw new ApiError(404,"Problem not found");
  }

  const testCases=problem.testCases;
  const {allPassed,results}=await runAgainstTestCases(language,code,testCases);
  let verdict="Accepted - All Testcases Passed";
  if(!allPassed){
    verdict=`${results.length} testcase(s) attempted, failed on test ${results.length}`;
  }
  
  return res.status(200).json(new ApiResponse(200,results,verdict));

  
});

export { executeCode };