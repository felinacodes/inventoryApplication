const { Router } = require('express');
const { getAllDirectors, getDirectorById, createDirector, 
    updateDirectorGet, updateDirectorPost, deleteDirector } = require ("../controllers/directorsController");
const upload = require('./multer');

const directorsRouter = Router();

directorsRouter.get("/",getAllDirectors );
directorsRouter.get("/:id", getDirectorById);
directorsRouter.post("/", upload, createDirector);
directorsRouter.get("/:id/update", updateDirectorGet);
directorsRouter.post("/:id/update", upload, updateDirectorPost);
directorsRouter.post("/:id/delete", deleteDirector);

module.exports = directorsRouter;