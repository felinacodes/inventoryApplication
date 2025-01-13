const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const moviesRouter = require("./routes/moviesRouter");
const searchRouter = require("./routes/searchRouter");
const actorsRouter = require("./routes/actorsRouter");
const directorsRouter = require("./routes/directorsRouter");
const path = require("path");

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

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

/*
TODO: //
* 1. fix errors everywhere.
* 2. Style.
? 3. Fix db false info. 
? 4. Add documentation.
! 5. Deploy.
*/
