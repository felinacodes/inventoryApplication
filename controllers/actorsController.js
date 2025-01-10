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

const validateActor = [
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

exports.getAllActors = async(req, res) => {
    const { sort_by = 'first_name', order = 'asc', filter } = req.query;
    const actors = await db.getAllActors(sort_by, order, filter);
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
        ]
    });
}

exports.getActorById = async(req, res) => {
    const actor = await db.getActorById(req.params.id);
    const movies = await db.getAllMoviesByActor(req.params.id);
    res.render("actor", { 
        actor: actor,
        movies: movies
    });
}

exports.createActor = [
    validateActor,
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
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
                    ]
                });
        }
        const photoUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        const { f_name, l_name, gender, birth_date } = req.body;
        await db.addActor(
            f_name || null,
            l_name || null,
            gender || null,
            birth_date || null,
            photoUrl
        );
        
        res.redirect(`/actors?sort_by=first_name&order=asc&filter=all`);
    }
]

exports.updateActorGet = async(req, res) => {
    const actor = await db.getActorById(req.params.id);
    res.render("updateActor",
        {actor: actor});
}

exports.updateActorPost = [
    validateActor,
    async(req, res) => {
        const actor = await db.getActorById(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("updateActor", {
                actor: actor,
                errors: errors.array()
            });
        }
        let photoUrl = actor.photo_url;
        // const photoUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        if (req.file) {
            // Delete the old photo if a new one is uploaded
            if (actor.photo_url) {
                deleteFile(actor.photo_url);
            }
           photoUrl = `/public/uploads/${req.file.filename}`;
        }
        const { f_name, l_name, gender, birth_date} = req.body;
        await db.updateActor(req.params.id, f_name, l_name, gender, birth_date ? birth_date : null, photoUrl);
        res.redirect(`/actors/${req.params.id}`);
    }
];

exports.deleteActor = async (req,res) => {
    const actor = await db.getActorById(req.params.id);
    if (actor.photo_url) {
        deleteFile(actor.photo_url);
    }
    await db.deleteActor(req.params.id);
    res.redirect("/actors");
};


