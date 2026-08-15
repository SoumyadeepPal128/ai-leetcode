import { Schema } from "mongoose";

const testCaseSchema = new Schema(
  {
    input: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
  },
  { _id: false } // don't generate a separate _id for each test case sub-document
);

export default testCaseSchema;