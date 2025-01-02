const { Router } = require('express');
const { getAllCategories, getCategoryById, 
    createCategory, updateCategoryGet, 
    updateCategoryPost, deleteCategory} = require ("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById);
categoriesRouter.post("/", createCategory);
categoriesRouter.get("/:id/update", updateCategoryGet);
categoriesRouter.post("/:id/update", updateCategoryPost);
categoriesRouter.post("/:id/delete", deleteCategory);

module.exports = categoriesRouter;