const { Router } = require('express');
const {searchController ,validateSearchQuery} = require("../controllers/searchController");
const asyncHandler = require('express-async-handler');

const searchRouter = Router();

searchRouter.get("/", ...validateSearchQuery, asyncHandler(searchController));

module.exports = searchRouter;