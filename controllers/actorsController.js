const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const fs = require("fs");
const path = require("path");
const uploadMiddleware = require("../routes/multer");


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
        .isLength({ min: 1, max: 20 }).withMessage(lengthErr)
]

exports.getAllActors = async(req, res) => {
    const actors = await db.getAllActors();
    console.log(actors);
    res.render("actors", { actors: actors });
}

exports.getActorById = async(req, res) => {
    const actor = await db.getActorById(req.params.id);
    res.render("actor", { actor: actor });
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
                    errors: errors.array()
                });
        }
        const photoUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        await db.addActor(req.body.f_name, req.body.l_name, req.body.gender, photoUrl);
        res.redirect("/actors");
    }
]

exports.updateActorGet = async(req, res) => {
    const actor = await db.getActorById(req.params.id);
    res.render("updateActor",
        {actor: actor});
}

exports.updateActorPost = [
    validateActor,
    uploadMiddleware, // Apply multer middleware here
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
        if (req.file) {
            // Delete the old photo if a new one is uploaded
            if (actor.photo_url) {
                deleteFile(actor.photo_url);
            }
            photoUrl = `/public/uploads/${req.file.filename}`;
        }
        await db.updateActor(req.params.id, req.body.f_name, req.body.l_name, req.body.gender, photoUrl);
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


