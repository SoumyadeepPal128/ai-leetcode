import { Problem } from "../models/problem.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";

const getProblemById=asyncHandler(async (req,res)=>{
    const {problemId}=req.params;
    const problem=Problem.findById(problemId);
    if(!problem){
        throw new ApiError(404,"Problem not found");
    }
    return res.status(200).json( new ApiResponse(200,problem,"Problem fetched successfully"));
})

const createProblem=asyncHandler(async (req,res)=>{
    const {title,description,prompt,referenceSolution,testCases}=req.body;

    const problem=await Problem.create({
        title,
        description,
        prompt,
        referenceSolution,
        testCases,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    });

    return res.status(201).json(new ApiResponse(201,problem,"Problem created successfully"));
})

const deleteProblem=asyncHandler(async (req,res)=>{
    const {problemId}=req.params;

    const problem=await Problem.findByIdAndDelete(problemId);
    if(!problem){
        throw new ApiError(201,"Problem not found");
    }
    return res.status(200).json(new ApiResponse(200,problem,"Problem deleted successfully"));
})

export {
    getProblemById,
    createProblem,
    deleteProblem,
}
