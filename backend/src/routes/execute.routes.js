import { Router } from "express";
import { executeCodeValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { executeCode } from "../controllers/execute.controllers.js";

const router = Router();

router.post("/", executeCodeValidator(), validate, executeCode);

export default router;