const { Router } = require('express');
const { getAllMovies, getMovieById, createMovie, 
    updateMovieGet, updateMoviePost, deleteMovie,
    getAllYears, renderMoviesPage, validateMovie} = require("../controllers/moviesController");
const upload = require('../middleware/multer');
const verifyPassword = require('../middleware/verifyPassowrd');
const asyncHandler = require('express-async-handler');

const moviesRouter = Router();

moviesRouter.get("/", asyncHandler(getAllMovies), asyncHandler(getAllYears), asyncHandler(renderMoviesPage));
moviesRouter.get("/:id", asyncHandler(getMovieById));
moviesRouter.post("/", upload, ...validateMovie, asyncHandler(createMovie));
moviesRouter.get("/:id/update", asyncHandler(updateMovieGet));
moviesRouter.post("/:id/update",upload,  ...validateMovie, verifyPassword, asyncHandler(updateMoviePost));
moviesRouter.post("/:id/delete", verifyPassword, asyncHandler(deleteMovie));

module.exports = moviesRouter;