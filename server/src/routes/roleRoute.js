import express from "express";

import {
    createRole,
    getRoles,
    updateRole,
    deleteRole
} from "../controllers/roleController.js";

const router = express.Router();

router.post("/createrole", createRole);

router.get("/getroles", getRoles);

router.put("/:id", updateRole);

router.delete("/:id", deleteRole);

export default router;