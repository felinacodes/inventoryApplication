const { Router } = require('express');
const { getAllCategories, getCategoryById, createCategory } = require ("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById);
categoriesRouter.post("/", createCategory);

module.exports = categoriesRouter;