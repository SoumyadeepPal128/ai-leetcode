import { Router } from "express";
import { executeCodeValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { executeCode } from "../controllers/execute.controllers.js";

const router = Router();

router.post(
  "/",
  executeCodeValidator(), // 1. field-level checks (problemId, language, code present/valid)
  validate,                // 2. stop with 422 if any of the above failed
  asyncHandler(executeCode) // 3. run the controller, auto-catch any thrown/async errors
);

export default router;