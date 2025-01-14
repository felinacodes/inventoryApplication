const { Router } = require('express');
const { getAllCategories, getCategoryById, 
    createCategory, updateCategoryGet, 
    updateCategoryPost, deleteCategory,
    getAllYears, renderMoviesPage, validateCategory, 
} = require ("../controllers/categoriesController");
const verifyPassword = require('../middleware/verifyPassowrd');
const asyncHandler = require('express-async-handler');

const categoriesRouter = Router();

categoriesRouter.get("/", asyncHandler(getAllCategories));
categoriesRouter.get("/:id", asyncHandler(getCategoryById),asyncHandler(getAllYears),asyncHandler(renderMoviesPage));
categoriesRouter.post("/", ...validateCategory, asyncHandler(createCategory));
categoriesRouter.get("/:id/update", asyncHandler(updateCategoryGet));
categoriesRouter.post("/:id/update", ...validateCategory, verifyPassword, asyncHandler(updateCategoryPost));
categoriesRouter.post("/:id/delete", verifyPassword, asyncHandler(deleteCategory));

module.exports = categoriesRouter;