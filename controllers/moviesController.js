const { body, validationResult } = require("express-validator");

const lengthErr = "Title must be between 1 and 50 characters.";

const movies = [
    { id: 1, title: "The Shawshank Redemption", year: 1994 },
    { id: 2, title: "The Godfather", year: 1972 },
    { id: 3, title: "The Dark Knight", year: 2008 },
    { id: 4, title: "The Lord of the Rings: The Return of the King", year: 2003 },
    { id: 5, title: "Pulp Fiction", year: 1994 },
    { id: 6, title: "Schindler's List", year: 1993 },
    { id: 7, title: "Inception", year: 2010 },
    { id: 8, title: "Fight Club", year: 1999 },
    { id: 9, title: "Forrest Gump", year: 1994 },
    { id: 10, title: "The Matrix", year: 1999 },
];

const validateMovie = [
    body("title").trim().escape()
        .isLength({ min: 1, max: 50 }).withMessage(lengthErr)
]


exports.getAllMovies = (req, res) => {    
    res.render("movies", { movies: movies });
};

exports.getMovieById = (req, res) => {            
    res.render("movie", { movie: movies.find(movie => movie.id == req.params.id) });
    // res.send(`Movie with id ${req.params.id}`);
};

// exports.createMovie = (req, res) => {
//     const movie = {
//         id: movies.length + 1,
//         title: req.body.title,
//         year: req.body.year
//     };
//     movies.push(movie);
//     res.redirect("/movies");
// };

exports.createMovie = [
    validateMovie,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("movies",
                {
                    movies: movies,
                    errors: errors.array()
                });
        }
        const movie = {
            id: movies.length + 1,
            title: req.body.title,
            year: req.body.year
        };
        movies.push(movie);
        res.redirect("/movies");
    }
];

