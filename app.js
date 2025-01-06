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
    { text: "search", href: "/search" },
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

make directors. 
make movies.

1. populate queries
2. fix controller to work with the db.
3. update views/controllers to handle new fields.
4. fix delete functionality.
5. handle errors everywhere.
6. secure update/delete.
7. add search functionality.
13. add pagination.
14. add sorting.
15. add filtering.
16. style.
17. add documentation.
18. deploy.



*/

