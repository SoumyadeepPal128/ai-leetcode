import { Router } from "express";
import { generateProblem } from "../controllers/generate.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { generateProblemValidator } from "../validators/index.js";

const router=Router();

router.post("/",generateProblemValidator(),validate,generateProblem);

export default router;