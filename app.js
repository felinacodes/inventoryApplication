const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const moviesRouter = require("./routes/moviesRouter");
const searchRouter = require("./routes/searchRouter");
const actorsRouter = require("./routes/actorsRouter");
const directorsRouter = require("./routes/directorsRouter");
const path = require("path");
const errorHandler = require("./middleware/errorHandling");
const { 
    CustomError, 
    CustomNotFoundError, 
} = require('./middleware/errorHandling');
require('dotenv').config(); // remove ? 

const links = [
    { text: "home", href: "/" },
    { text: "categories", href: "/categories" },
    { text: "movies", href: "/movies" },
    { text: "actors", href: "/actors" },
    { text: "directors", href: "/directors" }, 
];


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.links = links;
    next();
});

app.use("/search", searchRouter);
app.use("/categories", categoriesRouter);
app.use("/movies", moviesRouter);
app.use("/actors", actorsRouter);
app.use("/directors", directorsRouter);
app.use("/", indexRouter);

app.use((req, res, next) => {
    next(new CustomNotFoundError("Page not found."));
});

app.use((err, req, res, next) => {
   console.log(err);
    const responseMessage = process.env.NODE_ENV === 'development' ? err.message : 'An error occurred.';
    if (err instanceof CustomError) {
        console.log(process.env.NODE_ENV);
        // const responseMessage = process.env.NODE_ENV === 'development' ? err.message : 'An error occurred.';
        return res.status(err.statusCode).json({message: responseMessage});
    }
    if (err instanceof CustomNotFoundError) {
        return res.status(err.statusCode).json({message: responseMessage});
    }

    if (req.fileValidationError) {
        // return res.status(400).render('partials/errors', { message: req.fileValidationError.message });
        console.log('in pass');
        return res.status(500).json({message: responseMessage});
    }

    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;

/*
TODO: //
! 1. Validation. 
? 2. Move files in correct folders.
* 3. Style.
? 4. Fix db false info. 
? 5. Add documentation.
! 6. Deploy.
*/
