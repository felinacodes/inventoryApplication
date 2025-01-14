const { Router } = require('express');
const searchController = require("../controllers/searchController");
const asyncHandler = require('express-async-handler');

const searchRouter = Router();

searchRouter.get("/", asyncHandler(searchController));

module.exports = searchRouter;