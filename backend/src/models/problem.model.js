import mongoose, { Schema } from "mongoose";
import {Testcase} from "./testcase.model.js"

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    referenceSolution: {
      type: String,
      required: true,
    },
    testCases: {
      type: [Testcase],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A problem must have at least one test case",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // must match whatever name your pasted auth code registers the User model under, e.g. mongoose.model("User", userSchema)
      required: false, // optional until auth is wired in - flip to true once every problem is guaranteed to have a logged-in creator
    },
  },
  { timestamps: true }
);

export const Problem = mongoose.model("Problem", problemSchema);