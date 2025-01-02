const { Router } = require('express');
const { getAllMovies, getMovieById, createMovie, updateMovieGet, updateMoviePost} = require("../controllers/moviesController");

const moviesRouter = Router();

moviesRouter.get("/", getAllMovies);

moviesRouter.get("/:id", getMovieById);
moviesRouter.post("/", createMovie);
moviesRouter.get("/:id/update", updateMovieGet);
moviesRouter.post("/:id/update", updateMoviePost);

module.exports = moviesRouter;