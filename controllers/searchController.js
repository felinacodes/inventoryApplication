const db = require("../db/queries");
const { body, validationResult } = require("express-validator");


// const validateMovie = [
//     body("title").trim().escape()
//         .isLength({ min: 1, max: 50 }).withMessage(lengthErr),
//     body("year")
//         .isInt({ min: 1895, max: 2500 }).withMessage("Year must be between 1895 and 2500."),
//     body("description").trim().escape()
//         .isLength({ min: 1, max: 500 }).withMessage("Description must be between 1 and 500 characters.")
// ]

async function searchController(req, res) {
    const query = req.query.q;
    if (!query) {
      return res.render('searchResults', { results: []});
    }

        const movies = await db.searchMovies(query);
        const actors = await db.searchActors(query);
        const directors = await db.searchDirectors(query);
        const genres = await db.searchGenres(query);

        const results = {
          movies,
          actors,
          directors,
          genres
      };

      res.render('searchResults', { results });
};

module.exports = searchController;