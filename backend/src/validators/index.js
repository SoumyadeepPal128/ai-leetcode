import { body } from "express-validator";
import { SUPPORTED_LANGUAGES } from "../utils/constants.js";

const generateProblemValidator = () => {
  return [
    body("prompt")
      .trim()
      .notEmpty()
      .withMessage("Prompt is required")
      .isLength({ min: 5 })
      .withMessage("Prompt must be at least 5 characters long"),
  ];
};

const executeCodeValidator = () => {
  return [
    body("problemId").trim().notEmpty().withMessage("problemId is required"),
    body("language")
      .notEmpty()
      .withMessage("language is required")
      .isIn(SUPPORTED_LANGUAGES)
      .withMessage(`language must be one of: ${SUPPORTED_LANGUAGES.join(", ")}`),
    body("code").trim().notEmpty().withMessage("code is required"),
  ];
};

export { generateProblemValidator, executeCodeValidator };