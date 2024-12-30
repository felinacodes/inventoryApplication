const e = require("express");

const genres = [
    {
        id: 1,
        name: "Action"
    },
    {
        id: 2,
        name: "Comedy"
    },
    {
        id: 3,
        name: "Drama"
    }
];

exports.getAllCategories = (req, res) => {
    res.render("genres", { genres: genres });
};

exports.getCategoryById = (req, res) => {
    // console.log('here');
    // console.log(req.params.id);
    res.render("genre", { genre: genres.find(genre => genre.id == req.params.id) });
    // res.send(`Category with id ${req.params.id}`);
}