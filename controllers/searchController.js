const db = require("../db/queries");
const { query, validationResult } = require("express-validator");


const validateSearchQuery = [
  query("q").trim().escape()
      .isLength({ min: 1, max: 50 }).withMessage("Search query must be between 1 and 50 characters.")
];

const searchController = async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.render('partials/searchResults', { 
          results: null,
          errors: errors.array(),
      });
  }
        const query = req.query.q;

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

      res.render('partials/searchResults', { results });
};

module.exports = {
  searchController,
  validateSearchQuery,
};