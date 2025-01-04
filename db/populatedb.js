const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (20)
);

CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (20),
    last_name VARCHAR (20),
    gender VARCHAR (6),
    photo_url TEXT
);

CREATE TABLE IF NOT EXISTS directors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (20),
    last_name VARCHAR (20)
);

CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR (50),
    year INTEGER,
    description TEXT,
    photo_url TEXT 
);

CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INTEGER,
    actor_id INTEGER,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (actor_id) REFERENCES actors (id)
);

CREATE TABLE IF NOT EXISTS movie_directors (
    movie_id INTEGER,
    director_id INTEGER,
    PRIMARY KEY (movie_id, director_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (director_id) REFERENCES directors (id)
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INTEGER,
    genre_id INTEGER,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (genre_id) REFERENCES genres (id)
);

INSERT INTO genres (name) 
VALUES 
    ('action'),
    ('comedy'),
    ('drama'),
    ('horror'),
    ('sci-fi'),
    ('thriller');

INSERT INTO actors (first_name, last_name, gender, photo_url)
VALUES 
    ('Leonardo', 'DiCaprio', 'Male', '/public/images/actors/leonardo_dicaprio.jpg'),
    ('Brad', 'Pitt', 'Male', '/public/images/actors/brad_pitt.jpg'),
    ('Aaron', 'Paul', 'Male', '/public/images/actors/aaron_paul.jpg'),
    ('Al', 'Pacino', 'Male', '/public/images/actors/al_pacino.jpg'),
    ('Angelina', 'Jolie', 'Female', '/public/images/actors/angelina_jolie.jpg');
`;

async function main() {
    console.log("seeding...");
  
    const client = new Client({
      host: process.env.HOST,
      user: process.env.USER,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.PORT,
      ssl: {
        rejectUnauthorized: false,
      }, 
    });
  
    try {
      await client.connect();
      await client.query(SQL);
      console.log("Database seeded successfully");
    } catch (err) {
      console.error("Error seeding database:", err);
    } finally {
      await client.end();
      console.log("Connection closed");
    }
  }
  
  main();



