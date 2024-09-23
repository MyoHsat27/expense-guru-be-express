import express, { Router, Request, Response } from "express";
import { CategoryController } from "../../../controllers/v1/categoryController";
import { authenticateJWT } from "../../../middleware/authenticate";

const router: Router = express.Router();
const { createCategory, updateCategory, deleteCategory } = CategoryController();


router.post("/create", authenticateJWT, createCategory);
router.put("/:id", authenticateJWT, updateCategory);
router.delete("/:id", authenticateJWT, deleteCategory)

export default router;
