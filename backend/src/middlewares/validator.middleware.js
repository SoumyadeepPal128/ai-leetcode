import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-errors.js";
/**
 * Runs after the body(...) chains from a validator file. Checks whether
 * any of those chains recorded an error, and if so, stops the request
 * with a 400 and a clean list of what went wrong.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next(); // no errors — let the controller run
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));
  //used ApiError for convenience
  throw new ApiError(422,"Received data is not valid",extractedErrors);
}