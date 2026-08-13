import express from "express";

import { createLetter, searchLetterByNumber, updateLetter, getAllLetters, getAllLettersByRole, getDashboardCounts, filterLetters, deleteLetter, getReportData, getLettersForReply, replyToLetter } from "../controllers/letterController.js";

const router = express.Router();


router.post("/", createLetter);

router.get("/getallletter", getAllLetters);

router.get("/getalllettersbyrole", getAllLettersByRole);

router.get("/getlettersforreply", getLettersForReply);

router.get("/getcounts", getDashboardCounts);

router.get("/filter", filterLetters);

router.get("/reports", getReportData);

router.get("/:letterNumber", searchLetterByNumber);

router.put("/:letterNumber/reply", replyToLetter);

router.put("/:letterNumber", updateLetter);

router.delete("/:letterNumber", deleteLetter);


export default router;