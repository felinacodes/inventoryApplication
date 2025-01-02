const { Router } = require('express');
const { getAllMovies, getMovieById, createMovie, 
    updateMovieGet, updateMoviePost, deleteMovie} = require("../controllers/moviesController");

const moviesRouter = Router();

moviesRouter.get("/", getAllMovies);

moviesRouter.get("/:id", getMovieById);
moviesRouter.post("/", createMovie);
moviesRouter.get("/:id/update", updateMovieGet);
moviesRouter.post("/:id/update", updateMoviePost);
moviesRouter.post("/:id/delete", deleteMovie);

module.exports = moviesRouter;