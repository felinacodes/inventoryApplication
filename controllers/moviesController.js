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



exports.getAllMovies = (req, res) => {    
    res.render("movies", { movies: movies });
};

exports.getMovieById = (req, res) => {            
    res.render("movie", { movie: movies.find(movie => movie.id == req.params.id) });
    // res.send(`Movie with id ${req.params.id}`);
};

