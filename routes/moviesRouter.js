const { Router } = require('express');
const { getAllMovies, getMovieById } = require("../controllers/moviesController");

const moviesRouter = Router();

moviesRouter.get("/", getAllMovies);

moviesRouter.get("/:id", getMovieById);

module.exports = moviesRouter;