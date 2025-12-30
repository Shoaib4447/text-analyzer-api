import { Router } from "express";
import { textAnalyzer } from "../controllers/textAnalyzer.js";
const router = Router();

router.post("/analyze", textAnalyzer);

export default router;
