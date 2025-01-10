const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const fs = require("fs");
const path = require("path");

const lengthErr = "Title must be between 1 and 50 characters.";

function deleteFile(filePath) {
    if (!filePath) {
        return;
    }
    fs.unlink(path.join(__dirname, '..', filePath), (err) => {
        if (err){
            console.error(`Error deleting file: ${filePath}`, err);
        } else {
            console.log(`File deleted: ${filePath}`);
        }
    });
}

const validateMovie = [
    body("title").trim().escape()
        .isLength({ min: 1, max: 50 }).withMessage(lengthErr),
    body("year")
        .isInt({ min: 1895, max: 2500 }).withMessage("Year must be between 1895 and 2500."),
    body("description").trim().escape()
        .isLength({ min: 1, max: 500 }).withMessage("Description must be between 1 and 500 characters.")
]


exports.getAllMovies =async (req, res, next) => {    
    const { sort_by = 'title', order = 'asc', filter } = req.query;
    const movies = await db.getAllMovies(sort_by, order, filter);
    const genres = await db.getAllCategories();
    const directors = await db.getAllDirectors();
    const actors = await db.getAllActors();
    req.moviesData = 
        { movies: movies,
          directors: directors,
          actors: actors,
          genres: genres,
          sort_by: req.query.sort_by,
          order: req.query.order,
          filter: req.query.filter,
                }
    next();
};

exports.getAllYears = async (req, res, next) => {
    const years = await db.getAllYears();
    req.moviesData.years = years;
    next();
};

exports.renderMoviesPage = (req, res) => {
    res.render("movies", req.moviesData);
};


exports.getMovieById = async(req, res) => {            
    const movie = await db.getMovieById(req.params.id);
    const genres = await db.getMovieGenres(req.params.id);
    const actors = await db.getMovieActors(req.params.id);
    const directors = await db.getMovieDirectors(req.params.id);
    res.render("movie", 
        { 
            movie: movie,
            genres: genres,
            actors: actors,
            directors: directors
        });
};



exports.createMovie = [
    validateMovie,
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
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
            });
        }
        const photoUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        const { title, year, description, genre, actors, directors } = req.body;
        const movieID = await db.addMovie(
            title || null,
            year || null,
            description || null,
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
    }
];

exports.updateMovieGet = async(req, res) => {
    const movie = await db.getMovieById(req.params.id);
    const MovieGenres = await db.getMovieGenres(req.params.id);
    const MovieDirectors = await db.getMovieDirectors(req.params.id);
    const MovieActors = await db.getMovieActors(req.params.id);
    const genres = await db.getAllCategories();
    const directors = await db.getAllDirectors();
    const actors = await db.getAllActors();
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

exports.updateMoviePost = [
    validateMovie,
    async(req,res) => {
        const movie = await db.getMovieById(req.params.id);
        const MovieGenres = await db.getMovieGenres(req.params.id);
        const MovieDirectors = await db.getMovieDirectors(req.params.id);
        const MovieActors = await db.getMovieActors(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
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
            deleteFile(photoUrl);
            photoUrl = `/public/uploads/${req.file.filename}`;
        }
           // photoUrl = `/public/uploads/${req.file.filename}`;
        //const movie = movies.find(movie => movie.id == req.params.id);
        const { title, year, description, genre, actors, directors } = req.body;
        await db.updateMovie(req.params.id, title, year, description, photoUrl);
        // Update genres associations

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
    }
];

exports.deleteMovie = async(req, res) => {
    const movie = await db.getMovieById(req.params.id);
    if (movie.photo_url) {
        deleteFile(movie.photo_url);
    }
    await db.deleteMovieGenres(req.params.id);
    await db.deleteMovieActors(req.params.id);
    await db.deleteMovieDirectors(req.params.id);

    await db.deleteMovie(req.params.id);

    res.redirect("/movies");
};
