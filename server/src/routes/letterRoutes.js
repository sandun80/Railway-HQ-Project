import express from "express";

import { createLetter, searchLetterByNumber, updateLetter, deleteLetter, getAllLetters, getDashboardCounts, filterLetters } from "../controllers/letterController.js";

const router = express.Router();


router.post("/", createLetter);

router.get("/getallletters", getAllLetters);

router.get("/getcounts", getDashboardCounts);

router.get("/filter", filterLetters);

router.get("/:letterNumber", searchLetterByNumber);

router.put("/:letterNumber", updateLetter);

router.delete("/:letterNumber", deleteLetter);


export default router;