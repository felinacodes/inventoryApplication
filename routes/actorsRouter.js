const { Router } = require('express');
const { getAllActors, getActorById, createActor, deleteActor, updateActorGet, 
    updateActorPost} = require ("../controllers/actorsController");
const upload = require('./multer');
const verifyPassword = require('../middleware/verifyPassowrd');

const actorsRouter = Router();

actorsRouter.get("/", getAllActors);
actorsRouter.get("/:id", getActorById);
actorsRouter.post("/", upload, createActor);
actorsRouter.get("/:id/update", updateActorGet);
actorsRouter.post("/:id/update", upload, verifyPassword, updateActorPost);
actorsRouter.post("/:id/delete", verifyPassword, deleteActor);

module.exports = actorsRouter;