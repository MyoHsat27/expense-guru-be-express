import express, { Router, Request, Response } from "express";
import { CategoryController } from "../../../controllers/v1/categoryController";

const router: Router = express.Router();
const { createCategory, updateCategory, deleteCategory, getCategoriesByUser } = CategoryController();


router.post("/create", createCategory);
router.get("/", getCategoriesByUser)
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory)

export default router;
