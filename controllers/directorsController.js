const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const fs = require("fs");
const path = require("path");


const alphaErr = "Must only contain letters.";
const lengthErr = "Must be between 1 and 20 characters.";

function deleteFile(filePath) {
    fs.unlink(path.join(__dirname, '..', filePath), (err) => {
        if (err){
            console.error(`Error deleting file: ${filePath}`, err);
        } else {
            console.log(`File deleted: ${filePath}`);
        }
    });
}

const validateDirector = [
    body("f_name").trim().escape()
        .isAlpha().withMessage(alphaErr)
        .isLength({ min: 1, max: 20 }).withMessage(lengthErr),
    body("l_name").trim().escape()
        .isAlpha().withMessage(alphaErr)
        .isLength({ min: 1, max: 20 }).withMessage(lengthErr),
        body("birth_date").optional({ checkFalsy: true }).isDate().withMessage("Invalid date format")
        .custom((value) => {
            const currentDate = new Date().toISOString().split('T')[0];
            if (value > currentDate) {
                throw new Error("Birth date cannot be in the future");
            }
            if (value < "1900-01-01") { 
                throw new Error("Birth date must be after 1900-01-01");
            }
            return true;
        })
]

exports.getAllDirectors = async(req, res) => {
    const { sort_by = 'first_name', order = 'asc', filter } = req.query;
    const directors = await db.getAllDirectors(sort_by, order, filter);
    res.render("directors", { 
        directors: directors,
        sort_by,
        order,
        filter,
        sortOptions: [
            { value: 'first_name', text: 'First Name' },
            { value: 'birth_date', text: 'Birth Date' },
        ],
        filterOptions: [
            'Male',
            'Female',
        ]
    });
}

exports.getDirectorById = async(req, res) => {
    const director = await db.getDirectorById(req.params.id);
    const movies = await db.getAllMoviesByDirector(req.params.id);
    res.render("director", { 
        director: director,
        movies: movies
    });
}

exports.createDirector = [
    validateDirector,
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const directors = await db.getAllDirectors();
            return res.status(400).render("directors",
                {
                    directors: directors,
                    errors: errors.array(),
                    sort_by: 'first_name',
                    order: 'asc',
                    filter: 'all',
                    sortOptions: [
                        { value: 'first_name', text: 'First Name' },
                        { value: 'birth_date', text: 'Birth Date' },
                    ],
                    filterOptions: [
                        'Male',
                        'Female',
                    ]
                });
        }
        const photoUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        const { f_name, l_name, gender, birth_date, death_date} = req.body;
        await db.addDirector(
            f_name || null,
            l_name || null,
            gender || null,
            birth_date || null,
            death_date || null,
            photoUrl
        );
        res.redirect("/directors");
    }
]

exports.updateDirectorGet = async(req, res) => {
    const director = await db.getDirectorById(req.params.id);
    res.render("updateDirector", { director: director });
}

exports.updateDirectorPost = [
    validateDirector,
    async(req, res) => {
        const director = await db.getDirectorById(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("updateDirector", {
                director: director,
                errors: errors.array()
            });
        }
        let photoUrl = director.photo_url;
        // const photoUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        if (req.file) {
            // Delete the old photo if a new one is uploaded
            if (director.photo_url) {
                deleteFile(director.photo_url);
            }
           photoUrl = `/public/uploads/${req.file.filename}`;
        }
        const { f_name, l_name, gender, birth_date, death_date} = req.body;

        // Validate birth_date and death_date
        // if (!birth_date && death_date) {
        //     return res.status(400).render("updateDirector", {
        //         director: director,
        //         errors: [{ msg: "Birth date is required if death date is provided." }]
        //     });
        // }

        await db.updateDirector(req.params.id, f_name, l_name, gender, birth_date ? birth_date : null, death_date ? death_date : null, photoUrl);
        res.redirect(`/directors/${req.params.id}`);
    }
];

exports.deleteDirector = async (req,res) => {
    const director = await db.getDirectorById(req.params.id);
    if (director.photo_url) {
        deleteFile(director.photo_url);
    }
    await db.deleteDirector(req.params.id);
    res.redirect("/directors");
};


