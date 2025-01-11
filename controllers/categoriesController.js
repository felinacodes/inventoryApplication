const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const alphaErr = "Must only contain letters.";
const lengthErr = "Must be between 1 and 20 characters.";

const validateCategory = [
    body("name").trim().escape()
        .isAlpha().withMessage(alphaErr)
        .isLength({ min: 1, max: 20 }).withMessage(lengthErr)
]


exports.getAllCategories = async(req, res) => {
    const genres = await db.getAllCategories();
    res.render("genres", { genres: genres });
}

exports.getCategoryById = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const { sort_by = 'title', order = 'asc', filter } = req.query;
    const genre = await db.getCategoryById(req.params.id);
    req.genreId = genre;
    const movies = await db.getAllMoviesByGenre(req.params.id, sort_by, order, filter, page, pageSize);
    const totalMovies = await db.getMoviesCountByGenre(genre.id, filter);
    req.moviesData = 
        { movies: movies,
          genre: genre,
          sort_by: req.query.sort_by,
          order: req.query.order,
          filter: req.query.filter,
          page: page,
          pageSize: pageSize,
          totalMovies: totalMovies
                }
    next();
};

exports.getAllYears = async (req, res, next) => {

    const years = await db.getAllYearsByGenre(req.genreId.id);
    req.moviesData.years = years;
    next();
};

exports.renderMoviesPage = (req, res) => {
    res.render("genre", req.moviesData);
};


exports.createCategory = [
    validateCategory,
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const genres = await db.getAllCategories();
            return res.status(400).render("genres",
                {
                    genres: genres,
                    errors: errors.array()
                });
        }
        await db.addCategory(req.body.name);
        res.redirect("/categories");
    }
]

exports.updateCategoryGet = async(req, res) => {
    const genre = await db.getCategoryById(req.params.id);
    res.render("updateGenre", 
        { genre: genre });
}

exports.updateCategoryPost = [
    validateCategory,
    async(req, res) => {
        const genre = await db.getCategoryById(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("updateGenre", {
                genre: genre,
                errors: errors.array()
            });
        }
      await db.updateCategory(req.params.id, req.body.name);
       res.redirect(`/categories/${req.params.id}`);
    }
    ];

exports.deleteCategory = async(req, res) => {
    await db.deleteCategory(req.params.id);
    res.redirect("/categories");
}
    
