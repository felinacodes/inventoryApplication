const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const fs = require("fs");
const path = require("path");
const { handleDatabaseError, checkDataExistence } = require('../utils/errorHandler');
const { deleteFile } = require ('../utils/deleteFile');


const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";

exports.validateActor = [
    body("f_name").trim().escape()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),
    body("l_name").trim().escape()
        .isAlpha().withMessage(`last name ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`Last name ${lengthErr}`),
    body("gender").optional().isIn(['Male', 'Female']).withMessage("Invalid gender value"),
        body("birth_date").optional({ checkFalsy: true }).isDate().withMessage("Invalid date format")
        .custom((value, {req }) => {
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
        .custom((value, {req}) => {
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

exports.getAllActors = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;

    const { sort_by = 'first_name', order = 'asc', filter } = req.query;
    const actors = await db.getAllActors(sort_by, order, filter, page, pageSize);

  
    const totalActors = await db.getActorsCount(filter);

    res.render("actors", { 
        actors, 
        sort_by, 
        order, 
        filter,
        sortOptions: [
            { value: 'first_name', text: 'First Name' },
            { value: 'birth_date', text: 'Birth Date' },
        ],
        filterOptions: [
            'Male',
            'Female'
        ],
        page,
        pageSize,
        totalActors,
    });
}

exports.getActorById = async(req, res, next) => {
    const actor = await db.getActorById(req.params.id);
    const movies = await db.getAllMoviesByActor(req.params.id);

    checkDataExistence(actor, next);

    res.render("actor", { 
        actor: actor,
        movies: movies
    });

}

exports.createActor = async(req, res) => {
         const errors = validationResult(req);
         const page = parseInt(req.query.page) || 1;
         const pageSize = parseInt(req.query.pageSize) || 12;
         const totalActors = await db.getActorsCount(req.body.filter);

        if (!errors.isEmpty()) {
            if (req.file) {
                const photoPath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
                fs.unlink(photoPath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${photoPath}`, err);
                    }
                });
            }
            const actors = await db.getAllActors();
            return res.status(400).render("actors",
                {
                    actors: actors,
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
                    totalActors,
                });
        }
        const photoUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        const { f_name, l_name, gender, birth_date, death_date } = req.body;
        await db.addActor(
            f_name || null,
            l_name || null,
            gender || null,
            birth_date || null,
            photoUrl,
            death_date || null
        );
        res.redirect(`/actors`);
    };

exports.updateActorGet = async(req, res, next) => {
    const actor = await db.getActorById(req.params.id);

    checkDataExistence(actor, next);

    res.render("updateActor",
        {actor: actor});
}

exports.updateActorPost = async(req, res) => {
        const actor = await db.getActorById(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             // Delete the uploaded photo if there are validation errors
            if (req.file) {
                const photoPath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
                fs.unlink(photoPath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${photoPath}`, err);
                    }
                });
            }
            return res.status(400).render("updateActor", {
                actor: actor,
                errors: errors.array()
            });
        }
        let photoUrl = actor.photo_url;
        if (req.file) {
            // Delete the old photo if a new one is uploaded
            if (actor.photo_url) {
                deleteFile(actor.photo_url);
            }
           photoUrl = `/public/uploads/${req.file.filename}`;
        }
        const { f_name, l_name, gender, birth_date, death_date} = req.body;
        await db.updateActor(req.params.id, f_name, l_name, gender, birth_date ? birth_date : null, death_date ? death_date : null, photoUrl);
        res.redirect(`/actors/${req.params.id}`);
    };

exports.deleteActor = async (req,res, next) => {
    const actor = await db.getActorById(req.params.id);
    if (actor.photo_url) {
        deleteFile(actor.photo_url);
    }
    const associatedMovies = await db.getAllMoviesByActor(req.params.id);
    if (associatedMovies.length > 0) {
        await db.deleteMovieActorsByActorId(req.params.id);
    }
    checkDataExistence(actor, next);
    
    await db.deleteActor(req.params.id);
    res.redirect("/actors");
};


