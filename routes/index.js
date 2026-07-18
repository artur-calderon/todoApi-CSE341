import { Router } from "express";
import todosRoutes from "./todos.js";
import categoriesRoutes from "./categories.js";

const router = Router();

router.use("/todos", todosRoutes);
router.use("/categories", categoriesRoutes);

export default router;
