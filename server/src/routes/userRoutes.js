import express from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/getusers", getUsers);

router.post("/createuser", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;