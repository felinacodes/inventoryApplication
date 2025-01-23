const db = require("../db/queries");


exports.getHomePage = async(req, res) => {
    const latest = await db.getLatest();
    const actorsBornToday = await db.getActorsBornToday();
    const directorsBornToday = await db.getDirectorsBornToday();
    // console.log(bornToday);
    res.render("index", {
        latest : latest,
        actorsBornToday : actorsBornToday,
        directorsBornToday : directorsBornToday, 
    });
};