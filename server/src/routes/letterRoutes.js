import express from "express";

import { createLetter, searchLetterByNumber, updateLetter } from "../controllers/letterController.js";

const router = express.Router();


router.post("/", createLetter);

router.get("/:letterNumber", searchLetterByNumber);

router.put("/:letterNumber", updateLetter);


export default router;