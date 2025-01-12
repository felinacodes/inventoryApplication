const { Router } = require('express');
const { getAllCategories, getCategoryById, 
    createCategory, updateCategoryGet, 
    updateCategoryPost, deleteCategory,
    getAllYears, renderMoviesPage, 
} = require ("../controllers/categoriesController");
const verifyPassword = require('../middleware/verifyPassowrd');

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById, getAllYears, renderMoviesPage);
categoriesRouter.post("/", createCategory);
categoriesRouter.get("/:id/update", updateCategoryGet);
categoriesRouter.post("/:id/update", verifyPassword, updateCategoryPost);
categoriesRouter.post("/:id/delete",verifyPassword,  deleteCategory);

module.exports = categoriesRouter;