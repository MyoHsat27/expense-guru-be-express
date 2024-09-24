import express, { Router, Request, Response } from "express";
import { CategoryController } from "../../../controllers/v1/categoryController";
import { authenticateJWT } from "../../../middleware/authenticate";

const router: Router = express.Router();
const { createCategory, updateCategory, deleteCategory, getCategoriesByUser } = CategoryController();


router.post("/create", authenticateJWT, createCategory);
router.get("/", authenticateJWT, getCategoriesByUser)
router.put("/:id", authenticateJWT, updateCategory);
router.delete("/:id", authenticateJWT, deleteCategory)

export default router;
