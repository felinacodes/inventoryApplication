const { Router } = require('express');
const { getHomePage } = require("../controllers/indexController");
const indexRouter = Router();
const asyncHandler = require('express-async-handler');

indexRouter.get("/", asyncHandler(getHomePage));

module.exports = indexRouter;