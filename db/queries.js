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

module.exports = {
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};