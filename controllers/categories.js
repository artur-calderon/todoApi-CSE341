import { ObjectId } from "mongodb";
import { db } from "../models/database/index.js";

const categoriesCollection = db.collection("categories");

// GET /categories - get all categories
async function getAllCategories(req, res, next) {
	try {
		const categories = await categoriesCollection.find().toArray();
		res.status(200).json(categories);
	} catch (error) {
		next(error);
	}
}

// GET /categories/:id - get one category by id
async function getCategoryById(req, res, next) {
	try {
		const id = req.params.id;

		if (!ObjectId.isValid(id)) {
			res.status(400);
			throw new Error("Invalid category id");
		}

		const category = await categoriesCollection.findOne({ _id: new ObjectId(id) });

		if (!category) {
			res.status(404);
			throw new Error("Category not found");
		}

		res.status(200).json(category);
	} catch (error) {
		next(error);
	}
}

// POST /categories - create a new category
async function createCategory(req, res, next) {
	try {
		const { name, description, color } = req.body;

		if (!name || !description || !color) {
			res.status(400);
			throw new Error("Please fill all required fields: name, description, color");
		}

		const newCategory = {
			name: name,
			description: description,
			color: color,
		};

		const result = await categoriesCollection.insertOne(newCategory);

		res.status(201).json({
			message: "Category created successfully",
			categoryId: result.insertedId,
		});
	} catch (error) {
		next(error);
	}
}

// PUT /categories/:id - update a category
async function updateCategory(req, res, next) {
	try {
		const id = req.params.id;

		if (!ObjectId.isValid(id)) {
			res.status(400);
			throw new Error("Invalid category id");
		}

		const { name, description, color } = req.body;

		if (!name || !description || !color) {
			res.status(400);
			throw new Error("Please fill all required fields: name, description, color");
		}

		const updatedCategory = {
			name: name,
			description: description,
			color: color,
		};

		const result = await categoriesCollection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: updatedCategory }
		);

		if (result.matchedCount === 0) {
			res.status(404);
			throw new Error("Category not found");
		}

		res.status(200).json({
			message: "Category updated successfully",
		});
	} catch (error) {
		next(error);
	}
}

// DELETE /categories/:id - delete a category
async function deleteCategory(req, res, next) {
	try {
		const id = req.params.id;

		if (!ObjectId.isValid(id)) {
			res.status(400);
			throw new Error("Invalid category id");
		}

		const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

		if (result.deletedCount === 0) {
			res.status(404);
			throw new Error("Category not found");
		}

		res.status(200).json({
			message: "Category deleted successfully",
		});
	} catch (error) {
		next(error);
	}
}

export {
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
