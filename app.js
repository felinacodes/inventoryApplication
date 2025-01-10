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
// app.use(express.static(path.join(__dirname, "public")));
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


//TODO 
/*
1. Add the filters to actors, directors and categories.
2. add pagination.
3. handle errors everywhere.
4. secure update/delete.
5. style.
6. add documentation.
7. deploy.
*/

