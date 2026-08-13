import express from "express";
import { getActivityLogs } from "../controllers/logController.js";

const router = express.Router();

router.get("/", getActivityLogs);

export default router;
