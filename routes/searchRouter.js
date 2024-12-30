const { Router } = require('express');
const searchController = require("../controllers/searchController");

const searchRouter = Router();

searchRouter.get("/", searchController);

module.exports = searchRouter;