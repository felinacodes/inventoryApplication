const pool = require('../db/pool');

async function getAllCategories() {
    const { rows } = await pool.query('SELECT * FROM genres');
    return rows;
}

async function getCategoryById(id) {
    const { rows } = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
    return rows[0];
}

async function addCategory(category) {
    await pool.query('INSERT INTO genres (name) VALUES ($1)', [category]);
}

async function updateCategory(id, name){
    await pool.query('UPDATE genres SET name = $1 WHERE id = $2', [name, id]);
}

async function deleteCategory(id) {
    await pool.query('DELETE FROM genres WHERE id = $1', [id]);
}

async function getAllActors() {
    const { rows } = await pool.query('SELECT * FROM actors');
    return rows;
}

async function getActorById(id) {
    const { rows } = await pool.query('SELECT * FROM actors WHERE id = $1', [id]);
    return rows[0]; 
}

async function addActor(f_name, l_name, gender, birth_date, photo_url) {
    await pool.query('INSERT INTO actors (first_name, last_name, gender, birth_date, photo_url) VALUES ($1, $2, $3, $4, $5)', [f_name, l_name, gender, birth_date, photo_url]);
}

async function updateActor(id, f_name, l_name, gender, birth_date, photo_url) {
    await pool.query('UPDATE actors SET first_name = $1, last_name = $2, gender = $3, birth_date = $4, photo_url = $5 WHERE id = $6',[f_name, l_name, gender, birth_date, photo_url, id]);
}

async function deleteActor(id) {
    await pool.query('DELETE FROM actors WHERE id = $1', [id]);
}

module.exports = {
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllActors,
    getActorById,
    addActor,
    updateActor,
    deleteActor,
};