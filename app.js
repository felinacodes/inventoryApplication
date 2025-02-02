const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const moviesRouter = require("./routes/moviesRouter");
const searchRouter = require("./routes/searchRouter");
const actorsRouter = require("./routes/actorsRouter");
const directorsRouter = require("./routes/directorsRouter");
const path = require("path");
const { 
    CustomError, 
    CustomNotFoundError, 
} = require('./middleware/errorHandling');
require('dotenv').config(); // remove ? 

const links = [
    { text: "Home", href: "/", selected: true },
    { text: "Genres", href: "/categories", selected: false},
    { text: "Movies", href: "/movies", selected: false },
    { text: "Actors", href: "/actors", selected: false },
    { text: "Directors", href: "/directors", selected: false }, 
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

app.get('*', (req, res, next) => {
    const currentUrl = req.originalUrl;
    links.map(link => {
        if (link.href === currentUrl) {
            link.selected = true;
        } else {
            link.selected = false;
        }
    });
    next();
})

app.use("/search", searchRouter);
app.use("/categories", categoriesRouter);
app.use("/movies", moviesRouter);
app.use("/actors", actorsRouter);
app.use("/directors", directorsRouter);
app.use("/", indexRouter);

app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/public')) {
        console.log(`Static file not found: ${req.originalUrl}`);
        return res.status(404).sendFile(path.join(__dirname, 'public', 'images', 'default.jpg'));
    }
    console.log('404 middleware reached for URL:', req.originalUrl);
    next(new CustomNotFoundError("Page not found."));
});


app.use((err, req, res, next) => {
   console.log(`from error middleware ${err}`);
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
        return res.status(500).json({message: responseMessage});
    }

    res.status(500).json({ message: 'Internal Server Error' });
});

// Process-level error handlers
process.on('uncaughtException', (err) => {
    console.error('from Uncaught Exception:', err);
    //restart the server or perform other recovery actions
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    //restart the server or perform other recovery actions
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${APP_PORT}`);
});

// // Graceful shutdown
// const shutdown = () => {
//     console.log('Gracefully shutting down');
//     server.close(() => {
//         console.log('Closed out remaining connections');
//         process.exit(0);
//     });

//     // Force close server after 10 seconds
//     setTimeout(() => {
//         console.error('Forcing shutdown');
//         process.exit(1);
//     }, 10000);
// };

// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// // Process-level error handlers
// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception:', err);
//     shutdown();
// });

// process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     shutdown();
// });


module.exports = app;


