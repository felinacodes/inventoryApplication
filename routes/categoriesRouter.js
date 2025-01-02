const { Router } = require('express');
const { getAllCategories, getCategoryById, createCategory, updateCategoryGet, updateCategoryPost} = require ("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById);
categoriesRouter.post("/", createCategory);
categoriesRouter.get("/:id/update", updateCategoryGet);
categoriesRouter.post("/:id/update", updateCategoryPost);

module.exports = categoriesRouter;