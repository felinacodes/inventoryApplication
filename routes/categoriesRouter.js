const { Router } = require('express');
const { getAllCategories, getCategoryById } = require ("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById);

module.exports = categoriesRouter;