const { Router } = require('express');
const { getAllDirectors, getDirectorById, createDirector, 
    updateDirectorGet, updateDirectorPost, deleteDirector,validateDirector } = require ("../controllers/directorsController");
const upload = require('../middleware/multer');
const verifyPassword = require('../middleware/verifyPassowrd');
const asyncHandler = require('express-async-handler');

const directorsRouter = Router();

directorsRouter.get("/",asyncHandler(getAllDirectors) );
directorsRouter.get("/:id", asyncHandler(getDirectorById));
directorsRouter.post("/", upload, ...validateDirector,asyncHandler(createDirector));
directorsRouter.get("/:id/update", asyncHandler(updateDirectorGet));
directorsRouter.post("/:id/update", upload, ...validateDirector,verifyPassword, asyncHandler(updateDirectorPost));
directorsRouter.post("/:id/delete", verifyPassword, asyncHandler(deleteDirector));

module.exports = directorsRouter;