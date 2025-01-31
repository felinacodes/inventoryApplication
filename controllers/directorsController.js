const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const fs = require("fs");
const path = require("path");
const { handleDatabaseError, checkDataExistence } = require('../utils/errorHandler');
const { deleteFile } = require("../utils/deleteFile");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";

exports.validateDirector = [
    body("f_name").trim().escape()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),
    body("l_name").trim().escape()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`Last name ${lengthErr}`),
        body("birth_date").optional({ checkFalsy: true }).isDate().withMessage("Invalid date format")
        .custom((value, { req }) => {
            const currentDate = new Date().toISOString().split('T')[0];
            if (value > currentDate) {
                throw new Error("Birth date cannot be in the future");
            }
            if (value < "1900-01-01") { 
                throw new Error("Birth date must be after 1900-01-01");
            }
            return true;
        }),
        body("death_date").optional({ checkFalsy: true }).isDate().withMessage("Invalid date format")
        .custom((value, { req }) => {
            const currentDate = new Date().toISOString().split('T')[0];
            if (value > currentDate) {
                throw new Error("Death date cannot be in the future");
            }
            if (value && req.body.birth_date && value < req.body.birth_date) {
                throw new Error("Death date cannot be before birth date");
            }
            if (value && !req.body.birth_date) {
                throw new Error("Birth date must be provided if death date is provided");
            }
            return true;
        })
]

exports.getAllDirectors = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;

    const { sort_by = 'first_name', order = 'asc', filter } = req.query;
    const directors = await db.getAllDirectors(sort_by, order, filter, page, pageSize);
    const totalDirectors = await db.getDirectorsCount(filter);
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
        ],
        page,
        pageSize,
        totalDirectors,
    });
}

exports.getDirectorById = async(req, res, next) => {
    const director = await db.getDirectorById(req.params.id);

    checkDataExistence(director, next);

    const movies = await db.getAllMoviesByDirector(req.params.id);
    res.render("director", { 
        director: director,
        movies: movies
    });
}

exports.createDirector = async(req, res) => {
         const errors = validationResult(req);
         const page = parseInt(req.query.page) || 1;
         const pageSize = parseInt(req.query.pageSize) || 12;
         const totalDirectors = await db.getDirectorsCount(req.body.filter);
        if (!errors.isEmpty()) {
            if (req.file) {
                           const photoPath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
                           fs.unlink(photoPath, (err) => {
                               if (err) {
                                   console.error(`Error deleting file: ${photoPath}`, err);
                               }
                           });
                       }
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
                    ],
                    page,
                    pageSize,
                    totalDirectors,
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
    };

exports.updateDirectorGet = async(req, res, next) => {
    const director = await db.getDirectorById(req.params.id);
    checkDataExistence(director, next);
    res.render("updateDirector", { director: director });
}

exports.updateDirectorPost = async(req, res) => {
        const director = await db.getDirectorById(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             if (req.file) {
                            const photoPath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
                            fs.unlink(photoPath, (err) => {
                                if (err) {
                                    console.error(`Error deleting file: ${photoPath}`, err);
                                }
                            });
                        }
            return res.status(400).render("updateDirector", {
                director: director,
                errors: errors.array()
            });
        }
        let photoUrl = director.photo_url;
        if (req.file) {
            // Delete the old photo if a new one is uploaded
            if (director.photo_url) {
                deleteFile(director.photo_url);
            }
           photoUrl = `/public/uploads/${req.file.filename}`;
        }
        const { f_name, l_name, gender, birth_date, death_date} = req.body;

        await db.updateDirector(req.params.id, f_name, l_name, gender, birth_date ? birth_date : null, death_date ? death_date : null, photoUrl);
        res.redirect(`/directors/${req.params.id}`);
    };

exports.deleteDirector = async (req,res, next) => {
    const director = await db.getDirectorById(req.params.id);
    checkDataExistence(director, next);
    if (director.photo_url) {
        deleteFile(director.photo_url);
    }
    const associatedMovies = await db.getAllMoviesByDirector(req.params.id);
    if (associatedMovies.length >0) {
        await db.deleteMovieDirectorsByDirectorId(req.params.id);
    }
    await db.deleteDirector(req.params.id);
    res.redirect("/directors");
};


