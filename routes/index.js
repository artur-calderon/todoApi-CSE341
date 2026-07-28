import { Router } from "express";
import todosRoutes from "./todos.js";
import categoriesRoutes from "./categories.js";
import authRoutes from "./auth.js";

const router = Router();

router.use("/", authRoutes);
router.use("/todos", todosRoutes);
router.use("/categories", categoriesRoutes);

export default router;
