const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const fs = require("fs");
const path = require("path");
const { handleDatabaseError, checkDataExistence } = require('../utils/errorHandler');
const { deleteFile } = require("../utils/deleteFile");
const lengthErr = "Title must be between 1 and 50 characters.";
const cloudinary = require('cloudinary').v2;


exports.validateMovie = [
    body("title").trim().escape()
        .isLength({ min: 1, max: 50 }).withMessage(lengthErr),
    body("year")
        .isInt({ min: 1895, max: 2500 }).withMessage("Year must be between 1895 and 2500."),
    body("description").optional({ checkFalsy: true }).trim().escape()
        .isLength({ min: 1, max: 500 }).withMessage("Description must be between 1 and 500 characters.")
]


exports.getAllMovies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const { sort_by = 'title', order = 'asc', filter } = req.query;

        const movies = await db.getAllMovies(sort_by, order, filter, page, pageSize);

        const totalMovies = await db.getMoviescount(filter);

        const genres = await db.getCompleteGenresList();
        const directors = await db.getCompleteDirectorsList();
        const actors = await db.getCompleteActorsList();

        // checkDataExistence(movies, genres, directors, actors, totalMovies, next);

        req.moviesData = {
            movies,
            directors,
            actors,
            genres,
            sort_by,
            order,
            filter,
            page,
            pageSize,
            totalMovies,
        };
        next();
    } catch (error) {
        handleDatabaseError(error, next);
    }
};

exports.getAllYears = async (req, res, next) => {
    const years = await db.getAllYears();
    req.moviesData.years = years;
    next();
};

exports.renderMoviesPage = (req, res) => {
    res.render("movies", req.moviesData);
};


exports.getMovieById = async(req, res, next) => {            
    const movie = await db.getMovieById(req.params.id);
    const genres = await db.getMovieGenres(req.params.id);
    const actors = await db.getMovieActors(req.params.id);
    const directors = await db.getMovieDirectors(req.params.id);

    checkDataExistence(movie, next);

    res.render("movie", 
        { 
            movie: movie,
            genres: genres,
            actors: actors,
            directors: directors
        });
};

exports.createMovie = async (req, res, next) => {
    try {
        console.log('createMovie - req.file:', req.file);
        const errors = validationResult(req);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const totalMovies = await db.getMoviescount(req.body.filter);

        if (!errors.isEmpty()) {
            if (req.file) {
                const parts = req.file.path.split('/');
                const filename = parts.pop().split('.')[0]; 
                const folder = parts.includes("uploads") ? "uploads/" : ""; 
                const publicId = folder + filename;
                cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        console.error(`Error deleting Cloudinary image: ${publicId}`, error);
                    } else {
                        console.log(`Deleted Cloudinary image: ${publicId}`, result);
                    }
                });
            }

            const movies = await db.getAllMovies();
            const genres = await db.getAllCategories();
            const directors = await db.getAllDirectors();
            const actors = await db.getAllActors();
            const years = await db.getAllYears();

            return res.render('movies', {
                errors: errors.array(),
                genres,
                directors,
                actors,
                movies,
                sort_by: 'title',
                order: 'asc',
                filter: 'all',
                sortOptions: [
                    { value: 'title', text: 'Title' },
                    { value: 'year', text: 'Year' }
                ],
                years, 
                page,
                pageSize,
                totalMovies,
            });
        }

        const photoUrl = req.file ? req.file.path : null;
        const safeDescription = req.body.description
        .replace(/\n/g, '<br>')  // Converts newlines to <br> tags
        .replace(/ /g, '&nbsp;') // Converts spaces to &nbsp;
        .replace(/&/g, '&amp;')  // Converts & to &amp;
        .replace(/</g, '&lt;')   // Converts < to &lt;
        .replace(/>/g, '&gt;')   // Converts > to &gt;
        .replace(/"/g, '&quot;') // Converts " to &quot;
        .replace(/'/g, '&#39;')  // Converts ' to &#39;
        .replace(/`/g, '&#96;'); // Converts ` to &#96;

        const { title, year, genre, actors, directors } = req.body;
        const movieID = await db.addMovie(
            title || null,
            year || null,
            safeDescription || null,
            photoUrl
        );

        if (!movieID) {
            throw new Error('Failed to retrieve movie ID after insertion.');
        }

        // Insert genres associations
        if (genre && Array.isArray(genre)) {
            for (const genreId of genre) {
                await db.addMovieGenre(movieID.id, genreId);
            }
        }

        // Insert actors associations
        if (actors && Array.isArray(actors)) {
            for (const actorId of actors) {
                await db.addMovieActor(movieID.id, actorId);
            }
        }

        // Insert directors associations
        if (directors && Array.isArray(directors)) {
            for (const directorId of directors) {
                await db.addMovieDirector(movieID.id, directorId);
            }
        }

        res.redirect("/movies");
    } catch (error) {
        console.error('createMovie - error:', error);
        next(error); // Pass the error to the error handling middleware
    }
};

exports.updateMovieGet = async(req, res, next) => {
    const movie = await db.getMovieById(req.params.id);
    const MovieGenres = await db.getMovieGenres(req.params.id);
    const MovieDirectors = await db.getMovieDirectors(req.params.id);
    const MovieActors = await db.getMovieActors(req.params.id);

    const genres = await db.getCompleteGenresList();
    const directors = await db.getCompleteDirectorsList();
    const actors = await db.getCompleteActorsList();

    checkDataExistence(movie, next);

    res.render("updateMovie", { 
        movie: movie,
        genres: genres,
        directors: directors,
        actors: actors, 
        MovieGenres: MovieGenres,
        MovieDirectors: MovieDirectors,
        MovieActors: MovieActors
    });
};

exports.updateMoviePost = async(req,res) => {
        const movie = await db.getMovieById(req.params.id);
        const MovieGenres = await db.getMovieGenres(req.params.id);
        const MovieDirectors = await db.getMovieDirectors(req.params.id);
        const MovieActors = await db.getMovieActors(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {        
             if (req.file) {
                const parts = req.file.path.split('/');
                const filename = parts.pop().split('.')[0]; 
                const folder = parts.includes("uploads") ? "uploads/" : ""; 
                const publicId = folder + filename;
                cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    console.error(`Error deleting Cloudinary image: ${publicId}`, error);
                } else {
                    console.log(`Deleted Cloudinary image: ${publicId}`);
                }
            });
            }

            const genres = await db.getAllCategories();
            const directors = await db.getAllDirectors();
            const actors = await db.getAllActors();
            return res.status(400).render("updateMovie",
                {
                    movie: movie,
                    genres: genres,
                    directors: directors,
                    actors: actors, 
                    MovieGenres: MovieGenres,
                    MovieDirectors: MovieDirectors,
                    MovieActors: MovieActors,
                    errors: errors.array()
                });
        }
             let photoUrl = movie.photo_url;
            if (req.file) {
                if (movie.photo_url) {
                    const parts = movie.photo_url.split('/');
                    const filename = parts.pop().split('.')[0]; 
                    const folder = parts.includes("uploads") ? "uploads/" : ""; 
                    const oldPublicId = folder + filename;
                    cloudinary.uploader.destroy(oldPublicId, (error, result) => {
                        if (error) {
                            console.error(`Error deleting old Cloudinary image: ${oldPublicId}`, error);
                        } else {
                            console.log(`Deleted old Cloudinary image: ${oldPublicId}`);
                        }
                    });   
                }

                // Update the photo URL with the new Cloudinary URL
                // movie.photo_url = req.file.path; // Use the Cloudinary URL
                photoUrl = req.file ? req.file.path : null;
        }
            
        const { title, year, description, genre, actors, directors } = req.body;
        await db.updateMovie(req.params.id, title, year, description, photoUrl);

         if (!movie) {
            throw new Error('Failed to retrieve movie ID after insertion.');
        }

        await db.deleteMovieGenres(req.params.id);
        await db.deleteMovieActors(req.params.id);
        await db.deleteMovieDirectors(req.params.id);
        // Insert genres associations
        if (genre && Array.isArray(genre)) {
            for (const genreId of genre) {
                await db.addMovieGenre(movie.id, genreId);
            }
        }

        // Insert actors associations
        if (actors && Array.isArray(actors)) {
            for (const actorId of actors) {
                await db.addMovieActor(movie.id, actorId);
            }
        }

        // Insert directors associations
        if (directors && Array.isArray(directors)) {
            for (const directorId of directors) {
                await db.addMovieDirector(movie.id, directorId);
            }
        }
        res.redirect(`/movies/${req.params.id}`);
    };

exports.deleteMovie = async(req, res, next) => {
    const movie = await db.getMovieById(req.params.id);
    if (movie.photo_url) {
        // deleteFile(movie.photo_url);
            const parts = movie.photo_url.split('/');
            const filename = parts.pop().split('.')[0]; // Extracts "photo-123456"
            const folder = parts.includes("uploads") ? "uploads/" : ""; // Checks if "uploads" is in the path
            const publicId = folder + filename;

            console.log(`Public ID to delete: ${publicId}`);

        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error(`Error deleting Cloudinary image: ${publicId}`, error);
            } else {
                console.log(`Deleted Cloudinary image: ${publicId}`, result);
            }
        });
    }

    checkDataExistence(movie, next);

    await db.deleteMovieGenres(req.params.id);
    await db.deleteMovieActors(req.params.id);
    await db.deleteMovieDirectors(req.params.id);

    await db.deleteMovie(req.params.id);

    res.redirect("/movies");
};


