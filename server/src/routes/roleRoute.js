import express from "express";

import {
    createRole,
    getRoles
} from "../controllers/roleController.js";

const router = express.Router();

router.post("/createrole", createRole);

router.get("/getroles", getRoles);

export default router;