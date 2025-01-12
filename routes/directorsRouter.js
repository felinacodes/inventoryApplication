const { Router } = require('express');
const { getAllDirectors, getDirectorById, createDirector, 
    updateDirectorGet, updateDirectorPost, deleteDirector } = require ("../controllers/directorsController");
const upload = require('./multer');
const verifyPassword = require('../middleware/verifyPassowrd');

const directorsRouter = Router();

directorsRouter.get("/",getAllDirectors );
directorsRouter.get("/:id", getDirectorById);
directorsRouter.post("/", upload, createDirector);
directorsRouter.get("/:id/update", updateDirectorGet);
directorsRouter.post("/:id/update", upload, verifyPassword, updateDirectorPost);
directorsRouter.post("/:id/delete", verifyPassword, deleteDirector);

module.exports = directorsRouter;