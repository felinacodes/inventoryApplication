const express = require("express");
const { body, validationResult } = require("express-validator");

const alphaErr = "Must only contain letters.";
const lengthErr = "Must be between 1 and 20 characters.";

const validateCategory = [
    body("name").trim().escape()
        .isAlpha().withMessage(alphaErr)
        .isLength({ min: 1, max: 20 }).withMessage(lengthErr)
]

const genres = [
    {
        id: 1,
        name: "Action"
    },
    {
        id: 2,
        name: "Comedy"
    },
    {
        id: 3,
        name: "Drama"
    }
];

exports.getAllCategories = (req, res) => {
    res.render("genres", { genres: genres });
};

exports.getCategoryById = (req, res) => {
    // console.log('here');
    // console.log(req.params.id);
    res.render("genre", { genre: genres.find(genre => genre.id == req.params.id) });
    // res.send(`Category with id ${req.params.id}`);
}

// exports.createCategory = (req, res) => { 
//     const genre = {
//         id: genres.length + 1,
//         name: req.body.name
//     };
//     genres.push(genre);
//     res.redirect("/categories");
// }

exports.createCategory = [
    validateCategory,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("genres",
                {
                    genres: genres,
                    errors: errors.array()
                });
        }
        const genre = {
            id: genres.length + 1,
            name: req.body.name
        };
        genres.push(genre);
        res.redirect("/categories");
    }
]

exports.updateCategoryGet = (req, res) => {
    const genre = genres.find(genre => genre.id == req.params.id);
    res.render("updateGenre", 
        { genre: genre });
}

exports.updateCategoryPost = [
    validateCategory,
    (req, res) => {
        const genre = genres.find(genre => genre.id == req.params.id);
        const genreIndex = genres.findIndex(genre => genre.id == req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("updateGenre", {
                genre: genre,
                errors: errors.array()
            });
        }
        genres[genreIndex].name = req.body.name;
       // res.render('genre', { genre: genre });
       res.redirect(`/categories/${req.params.id}`);
    }
    ];
    
