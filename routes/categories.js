import { Router } from "express";
import {
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
} from "../controllers/categories.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", isAuthenticated, createCategory);
router.put("/:id", isAuthenticated, updateCategory);
router.delete("/:id", isAuthenticated, deleteCategory);

export default router;
