const pool = require('../db/pool');

function buildMultiWordQuery(baseQuery, fields, words) {
    const conditions = [];
    const values = [];

    words.forEach((word, index) => {
        fields.forEach(field => {
            conditions.push(`${field} ILIKE $${values.length + 1}`);
            values.push(`%${word}%`);
        });
    });

    const whereClause = conditions.join(' OR ');
    return {
        query: `${baseQuery} WHERE ${whereClause}`,
        values
    };
}


async function getAllCategories() {
    const { rows } = await pool.query('SELECT * FROM genres ORDER BY LOWER(name)');
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

async function getAllActors(sort_by = 'first_name', order = 'asc', filter, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM actors';
    const queryParams = [];

    if (filter && filter !== 'all') {
        query += ' WHERE gender = $1';
        queryParams.push(filter);
    }

    const validSortColumns = ['first_name','age'];
    const validOrder = ['asc', 'desc'];

    if (!validSortColumns.includes(sort_by)) {
        sort_by = 'first_name';
    }

    if (!validOrder.includes(order)) {
        order = 'asc';
    }

     // Add sorting and ordering
     if (sort_by === 'first_name') {
        query += ` ORDER BY LOWER(first_name) ${order}, LOWER(last_name) ${order}`;
    } else {
        query += ` ORDER BY ${sort_by} ${order}`;
    }

      // Add pagination
      query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(pageSize, offset);

    const { rows } = await pool.query(query, queryParams);
    return rows;
}

async function getActorsCount(filter = '') {
    let query = 'SELECT COUNT(*) FROM actors';
    const queryParams = [];

    if (filter && filter !== 'all') {
        query += ' WHERE gender = $1';
        queryParams.push(filter);
    }

    const { rows } = await pool.query(query, queryParams);
    return parseInt(rows[0].count, 10);
}

async function getActorById(id) {
    const { rows } = await pool.query('SELECT * FROM actors WHERE id = $1', [id]);
    return rows[0]; 
}

async function addActor(f_name, l_name, gender, birth_date, photo_url, death_date) {
    await pool.query('INSERT INTO actors (first_name, last_name, gender, birth_date, death_date, photo_url) VALUES ($1, $2, $3, $4, $5, $6)', [f_name, l_name, gender, birth_date, death_date, photo_url]);
}

async function updateActor(id, f_name, l_name, gender, birth_date, death_date, photo_url) {
    await pool.query('UPDATE actors SET first_name = $1, last_name = $2, gender = $3, birth_date = $4, death_date = $5, photo_url = $6 WHERE id = $7',[f_name, l_name, gender, birth_date, death_date, photo_url, id]);
}

async function deleteActor(id) {
    await pool.query('DELETE FROM actors WHERE id = $1', [id]);
}

async function getAllDirectors(sort_by = 'first_name', order = 'asc', filter, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM directors';
    const queryParams = [];

    if (filter && filter!=='all') {
        query += ' WHERE gender = $1';
        queryParams.push(filter);
    }

    const validSortColumns = ['first_name', 'age'];
    const validOrder = ['asc', 'desc'];

    if (!validSortColumns.includes(sort_by)) {
        sort_by = 'first_name';
    }

    if (!validOrder.includes(order)) {
        order = 'asc';
    }

    if(sort_by === 'first_name') {
        query += ` ORDER BY LOWER(first_name) ${order}, LOWER(last_name) ${order}`;
    } else {
        query += ` ORDER BY ${sort_by} ${order}`;
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

    const { rows } = await pool.query(query, queryParams);
    return rows;
}

async function getDirectorsCount(filter = '') {
    let query = 'SELECT COUNT(*) FROM directors';
    const queryParams = [];

    if (filter && filter !== 'all') {
        query += ' WHERE gender ILIKE $1';
        queryParams.push(filter);
    }

    const { rows } = await pool.query(query, queryParams);
    return parseInt(rows[0].count, 10);
}

async function getDirectorById(id) {
    const { rows } = await pool.query('SELECT * FROM directors WHERE id = $1', [id]);
    return rows[0];
}

async function addDirector(f_name, l_name, gender, birth_date, death_date, photo_url) {
    await pool.query('INSERT INTO directors (first_name, last_name, gender, birth_date, death_date, photo_url) VALUES ($1, $2, $3, $4, $5, $6)', [f_name, l_name, gender, birth_date, death_date, photo_url]);
}

async function updateDirector(id, f_name, l_name, gender, birth_date, death_date, photo_url) {
    await pool.query('UPDATE directors SET first_name = $1, last_name = $2, gender = $3, birth_date = $4, death_date = $5, photo_url = $6 WHERE id = $7', [f_name, l_name, gender, birth_date, death_date, photo_url, id]);
}

async function deleteDirector(id) {
    await pool.query('DELETE FROM directors WHERE id = $1', [id]);
}

async function getAllMovies(sort_by = 'title', order = 'asc', filter, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM movies';
    const queryParams = [];

    // Handle filtering
    if (filter && filter !== 'all') {
        query += ' WHERE year = $1';
        queryParams.push(parseInt(filter, 10));
    }

    // Validate sort_by and order to prevent SQL injection
    const validSortColumns = ['title', 'year'];
    const validOrder = ['asc', 'desc'];

    if (!validSortColumns.includes(sort_by)) {
        sort_by = 'title';
    }

    if (!validOrder.includes(order)) {
        order = 'asc';
    }

    // Add sorting, ordering, and pagination
    if (sort_by === 'title') {
        query += ` ORDER BY LOWER(title) ${order}`;
    } else {
    query += ` ORDER BY ${sort_by} ${order}`;
    }

    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

    const { rows } = await pool.query(query, queryParams);
    return rows;
};

async function getAllYears(){
    const { rows } = await pool.query('SELECT DISTINCT year FROM movies ORDER BY year');
    return rows.map(row => row.year);
}

async function getAllYearsByGenre(id) {
    const { rows } = await pool.query(
        `SELECT DISTINCT year FROM movies m
         JOIN movie_genres mg ON m.id = mg.movie_id
         WHERE mg.genre_id = $1
         ORDER BY year`,
         [id]
    );
    return rows.map(row => row.year);
}

async function getMoviescount(filter = '') {
    let query = 'SELECT COUNT(*) FROM movies';
    const queryParams = [];

    // Handle filtering
    if (filter && filter !== 'all') {
        if (isNaN(filter)) {
            query += ' WHERE title ILIKE $1';
            queryParams.push(`%${filter}%`);
        } else {
            query += ' WHERE year = $1';
            queryParams.push(parseInt(filter, 10));
        }
    }

    const { rows } = await pool.query(query, queryParams);
    return parseInt(rows[0].count, 10);
}

async function getMoviesCountByGenre(genreId, filter = '') {
    let query = `
        SELECT COUNT(*) FROM movies m
        JOIN movie_genres mg ON m.id = mg.movie_id
        WHERE mg.genre_id = $1
    `;
    const queryParams = [genreId];

    // Handle filtering by year
    if (filter && filter !== 'all') {
        query += ' AND m.year = $2';
        queryParams.push(parseInt(filter, 10));
    }

    const { rows } = await pool.query(query, queryParams);
    return parseInt(rows[0].count, 10);
}

async function getMovieById(id) {
    const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    return rows[0];
}

async function addMovie(title, year, description, photo_url) {
    const result = await pool.query(
        'INSERT INTO movies (title, year, description, photo_url) VALUES ($1, $2, $3, $4) RETURNING id',
        [title, year, description, photo_url]
    );
    return result.rows[0]; 
}

async function addMovieGenre(movie_id, genre_id) {
    await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)', [movie_id, genre_id]);
}

async function addMovieActor(movie_id, actor_id) {
    await pool.query('INSERT INTO movie_actors (movie_id, actor_id) VALUES ($1, $2)', [movie_id, actor_id]);
}

async function addMovieDirector(movie_id, director_id) {
    await pool.query('INSERT INTO movie_directors (movie_id, director_id) VALUES ($1, $2)', [movie_id, director_id]);
}

async function getMovieGenres(movie_id) {
    const { rows } = await pool.query(
        `SELECT g.name, genre_id FROM genres g
         JOIN movie_genres mg ON g.id = mg.genre_id
         WHERE mg.movie_id = $1`,
        [movie_id]
    );
    return rows;
}

async function getMovieActors(movie_id) {
    const { rows } = await pool.query(
        `SELECT a.first_name, a.last_name, actor_id FROM actors a
         JOIN movie_actors ma ON a.id = ma.actor_id
         WHERE ma.movie_id = $1`,
        [movie_id]
    );
    return rows;
}

async function getMovieDirectors(movie_id) {
    const { rows } = await pool.query(
        `SELECT d.first_name, d.last_name, director_id FROM directors d
         JOIN movie_directors md ON d.id = md.director_id
         WHERE md.movie_id = $1`,
        [movie_id]
    );
    return rows;
}

async function updateMovie(id, title, year, description, photo_url) {
    await pool.query('UPDATE movies SET title = $1, year = $2, description = $3, photo_url = $4 WHERE id = $5', [title, year, description, photo_url, id]);
}

async function deleteMovieGenres(movie_id) {
    await pool.query('DELETE FROM movie_genres WHERE movie_id = $1', [movie_id]);
}

async function deleteMovieActors(movie_id) {
    await pool.query('DELETE FROM movie_actors WHERE movie_id = $1', [movie_id]);
}

async function deleteMovieDirectors(movie_id) {
    await pool.query('DELETE FROM movie_directors  WHERE movie_id = $1', [movie_id]);
}

async function deleteMovie(movie_id) {
    await pool.query('DELETE FROM movies WHERE id = $1', [movie_id]);
}

async function getAllMoviesByGenre(genre_id, sort_by = 'title', order = 'asc', filter, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM movies m JOIN movie_genres mg ON m.id = mg.movie_id WHERE mg.genre_id = $1';
    const queryParams = [genre_id];

    if (filter && filter !== 'all') {
        query += ' AND year = $2';
        queryParams.push(parseInt(filter, 10));
    }

    const validSortColumns = ['title', 'year'];
    const validOrder = ['asc', 'desc'];

    if (!validSortColumns.includes(sort_by)) {
        sort_by = 'title';
    }

    if (!validOrder.includes(order)) {
        order = 'asc';
    }

    if (sort_by === 'title') {
        query += ` ORDER BY LOWER(title) ${order}`;
    } else {
        query += ` ORDER BY ${sort_by} ${order}`;
    }

    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

    const { rows } = await pool.query(query, queryParams);
    return rows;
}

async function getAllMoviesByActor(actor_id) {
    const { rows } = await pool.query(
        `SELECT * FROM movies m
         JOIN movie_actors ma ON m.id = ma.movie_id
         WHERE ma.actor_id = $1`,
         [actor_id]
    );
    return rows;
}

async function getAllMoviesByDirector(director_id) {
    const { rows } = await pool.query(
        `SELECT * FROM movies m
         JOIN movie_directors md ON m.id = md.movie_id
         WHERE md.director_id = $1`,
         [director_id]
    );
    return rows;
}

async function searchMovies(query) {
    const { rows } = await pool.query('SELECT * FROM movies WHERE title ILIKE $1', [`%${query}%`]);
    return rows;
}

async function searchActors(query) {
    const words = query.split(' ');
    const { query: sqlQuery, values } = buildMultiWordQuery('SELECT * FROM actors', ['first_name', 'last_name'], words);
    const { rows } = await pool.query(sqlQuery, values);
    return rows;
}

async function searchDirectors(query) {
    const words = query.split(' ');
    const { query: sqlQuery, values } = buildMultiWordQuery('SELECT * FROM directors', ['first_name', 'last_name'], words);
    const { rows } = await pool.query(sqlQuery, values);
    return rows;
}

async function searchGenres(query) {
    const words = query.split(' ');
    const { query: sqlQuery, values } = buildMultiWordQuery('SELECT * FROM genres', ['name'], words);
    const { rows } = await pool.query(sqlQuery, values);
    return rows;
}

async function getCompleteGenresList() {
    const { rows } = await pool.query('SELECT * FROM genres');
    return rows;
};

async function getCompleteActorsList() {
    const { rows } = await pool.query('SELECT * FROM actors');
    return rows;
};

async function getCompleteDirectorsList() {
    const { rows } = await pool.query('SELECT * FROM directors');
    return rows;
};

async function deleteMovieActorsByActorId(actor_id) {
    await pool.query('DELETE FROM movie_actors WHERE actor_id = $1', [actor_id]);
};

async function deleteMovieGenresByGenreId(genre_id) {
    await pool.query('DELETE FROM movie_genres WHERE genre_id = $1', [genre_id]);
};

async function deleteMovieDirectorsByDirectorId(director_id) {
    await pool.query('DELETE FROM movie_directors WHERE director_id = $1', [director_id]);
};
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
    getAllDirectors,
    getDirectorById,
    addDirector,
    updateDirector,
    deleteDirector,
    getAllMovies,
    getMovieById,
    addMovie,
    addMovieGenre,
    addMovieActor,
    addMovieDirector,
    getMovieGenres,
    getMovieActors,
    getMovieDirectors,
    updateMovie,
    deleteMovieGenres,
    deleteMovieActors,
    deleteMovieDirectors,
    deleteMovie,
    getAllMoviesByGenre,
    getAllMoviesByActor,
    getAllMoviesByDirector,
    searchMovies,
    searchActors,
    searchDirectors,
    searchGenres,
    getAllYears,
    getAllYearsByGenre,
    getMoviescount,
    getActorsCount, 
    getDirectorsCount,
    getMoviesCountByGenre,
    getCompleteGenresList,
    getCompleteActorsList,
    getCompleteDirectorsList,
    deleteMovieActorsByActorId,
    deleteMovieGenresByGenreId,
    deleteMovieDirectorsByDirectorId,
};