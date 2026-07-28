import { Router } from "express";
import {
	getAllTodos,
	getTodoById,
	createTodo,
	updateTodo,
	deleteTodo,
} from "../controllers/todos.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.post("/", isAuthenticated, createTodo);
router.put("/:id", isAuthenticated, updateTodo);
router.delete("/:id", isAuthenticated, deleteTodo);

export default router;
