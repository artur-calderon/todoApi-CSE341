import { ObjectId } from "mongodb";
import { db } from "../models/database/index.js";

const todosCollection = db.collection("todos");
const categoriesCollection = db.collection("categories");

function getLoggedInUserId(req) {
	return new ObjectId(req.user._id);
}

async function getAllTodos(req, res, next) {
	try {
		const todos = await todosCollection.find({ userId: getLoggedInUserId(req) }).toArray();
		res.status(200).json(todos);
	} catch (error) {
		next(error);
	}
}

async function getTodoById(req, res, next) {
	try {
		const id = req.params.id;

		if (!ObjectId.isValid(id)) {
			res.status(400);
			throw new Error("Invalid todo id");
		}

		const todo = await todosCollection.findOne({
			_id: new ObjectId(id),
			userId: getLoggedInUserId(req),
		});

		if (!todo) {
			res.status(404);
			throw new Error("Todo not found");
		}

		res.status(200).json(todo);
	} catch (error) {
		next(error);
	}
}

async function createTodo(req, res, next) {
	try {
		const { title, description, completed, priority, dueDate, categoryId } = req.body;

		if (!title || !description || completed === undefined || !priority || !dueDate || !categoryId) {
			res.status(400);
			throw new Error(
				"Please fill all required fields: title, description, completed, priority, dueDate, categoryId"
			);
		}

		if (typeof completed !== "boolean") {
			res.status(400);
			throw new Error("completed must be a boolean (true or false)");
		}

		if (priority !== "low" && priority !== "medium" && priority !== "high") {
			res.status(400);
			throw new Error("priority must be low, medium, or high");
		}

		if (!ObjectId.isValid(categoryId)) {
			res.status(400);
			throw new Error("Invalid category id");
		}

		const category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId) });

		if (!category) {
			res.status(400);
			throw new Error("Category not found");
		}

		const newTodo = {
			title: title,
			description: description,
			completed: completed,
			priority: priority,
			dueDate: dueDate,
			categoryId: new ObjectId(categoryId),
			userId: getLoggedInUserId(req),
		};

		const result = await todosCollection.insertOne(newTodo);

		res.status(201).json({
			message: "Todo created successfully",
			todoId: result.insertedId,
		});
	} catch (error) {
		next(error);
	}
}

async function updateTodo(req, res, next) {
	try {
		const id = req.params.id;

		if (!ObjectId.isValid(id)) {
			res.status(400);
			throw new Error("Invalid todo id");
		}

		const { title, description, completed, priority, dueDate, categoryId } = req.body;

		if (!title || !description || completed === undefined || !priority || !dueDate || !categoryId) {
			res.status(400);
			throw new Error(
				"Please fill all required fields: title, description, completed, priority, dueDate, categoryId"
			);
		}

		if (typeof completed !== "boolean") {
			res.status(400);
			throw new Error("completed must be a boolean (true or false)");
		}

		if (priority !== "low" && priority !== "medium" && priority !== "high") {
			res.status(400);
			throw new Error("priority must be low, medium, or high");
		}

		if (!ObjectId.isValid(categoryId)) {
			res.status(400);
			throw new Error("Invalid category id");
		}

		const category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId) });

		if (!category) {
			res.status(400);
			throw new Error("Category not found");
		}

		const updatedTodo = {
			title: title,
			description: description,
			completed: completed,
			priority: priority,
			dueDate: dueDate,
			categoryId: new ObjectId(categoryId),
		};

		const result = await todosCollection.updateOne(
			{ _id: new ObjectId(id), userId: getLoggedInUserId(req) },
			{ $set: updatedTodo }
		);

		if (result.matchedCount === 0) {
			res.status(404);
			throw new Error("Todo not found");
		}

		res.status(200).json({
			message: "Todo updated successfully",
		});
	} catch (error) {
		next(error);
	}
}

async function deleteTodo(req, res, next) {
	try {
		const id = req.params.id;

		if (!ObjectId.isValid(id)) {
			res.status(400);
			throw new Error("Invalid todo id");
		}

		const result = await todosCollection.deleteOne({
			_id: new ObjectId(id),
			userId: getLoggedInUserId(req),
		});

		if (result.deletedCount === 0) {
			res.status(404);
			throw new Error("Todo not found");
		}

		res.status(200).json({
			message: "Todo deleted successfully",
		});
	} catch (error) {
		next(error);
	}
}

export { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo };
