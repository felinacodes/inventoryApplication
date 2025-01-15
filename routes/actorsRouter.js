const { Router } = require('express');
const { getAllActors, getActorById, createActor, deleteActor, updateActorGet, 
    updateActorPost, validateActor} = require ("../controllers/actorsController");
const upload = require('../middleware/multer');
const verifyPassword = require('../middleware/verifyPassowrd');
const asyncHandler = require('express-async-handler');

const actorsRouter = Router();

actorsRouter.get("/", asyncHandler(getAllActors));
actorsRouter.get("/:id", asyncHandler(getActorById));
actorsRouter.post("/", upload, ...validateActor, asyncHandler(createActor));
actorsRouter.get("/:id/update",asyncHandler(updateActorGet));
actorsRouter.post("/:id/update",upload, ...validateActor, verifyPassword,asyncHandler(updateActorPost));
actorsRouter.post("/:id/delete", verifyPassword, asyncHandler(deleteActor));

module.exports = actorsRouter;