const { Client } = require('pg');
require('dotenv').config();

const currentDate = new Date().toISOString().split('T')[0];

const SQL = `
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;


CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (20) NOT NULL
);

CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (20) NOT NULL,
    last_name VARCHAR (20) NOT NULL,
    gender VARCHAR (6),
    birth_date DATE CHECK (birth_date > '1900-01-01' AND birth_date <= '${currentDate}'),
    photo_url TEXT
);

CREATE TABLE IF NOT EXISTS directors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (20) NOT NULL,
    last_name VARCHAR (20) NOT NULL,
    gender VARCHAR (6),
    birth_date DATE CHECK (birth_date > '1900-01-01' AND birth_date <= '${currentDate}'),
    photo_url TEXT
);

CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR (50) NOT NULL,
    year INTEGER ,
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

INSERT INTO actors (first_name, last_name, gender, birth_date, photo_url)
VALUES 
    ('Leonardo', 'DiCaprio', 'Male', '1974-11-11', '/public/images/actors/leonardo_dicaprio.jpg'),
    ('Brad', 'Pitt', 'Male', '1963-12-18', '/public/images/actors/brad_pitt.jpg'),
    ('Aaron', 'Paul', 'Male', '1979-08-27', '/public/images/actors/aaron_paul.jpg'),
    ('Al', 'Pacino', 'Male', '1940-04-25', '/public/images/actors/al_pacino.jpg'),
    ('Angelina', 'Jolie', 'Female', '1975-06-04', '/public/images/actors/angelina_jolie.jpg'),
    ('Anna', 'Paquin', 'Female', '1982-07-24', '/public/images/actors/anna_paquin.jpg'),
    ('Benedict', 'Cumberbatch', 'Male', '1976-07-19', '/public/images/actors/benedict_cumberbatch.webp'),
    ('Bryan', 'Cranston', 'Male', '1956-03-07', '/public/images/actors/bryan_cranston.jpg'),
    ('Carly', 'Chaikin', 'Female', '1990-03-26', '/public/images/actors/carly_chaikin.webp'),
    ('Christian', 'Bale', 'Male', '1974-01-30', '/public/images/actors/christian_bale.jpg'),
    ('Cillian', 'Murphy', 'Male', '1976-05-25', '/public/images/actors/cillian_murphy.webp'),
    ('Daniel', 'Radcliffe', 'Male', '1989-07-23', '/public/images/actors/daniel_radcliffe.jpg'),
    ('Emma', 'Stone', 'Female', '1988-11-06', '/public/images/actors/emma_stone.jpg'),
    ('Emma', 'Watson', 'Female', '1990-04-15', '/public/images/actors/emma_watson.jpg'),
    ('Evan', 'Peters', 'Male', '1987-01-20', '/public/images/actors/evan_peters.webp'),
    ('Evangeline', 'Lilly', 'Female', '1979-08-03', '/public/images/actors/evangeline_lilly.webp'),
    ('Hugh', 'Jackman', 'Male', '1968-10-12', '/public/images/actors/hugh_jackman.jpg'),
    ('Jared', 'Leto', 'Male', '1971-12-26', '/public/images/actors/jared_leto.jpg'),
    ('Jennifer', 'Carpenter', 'Female', '1979-12-07', '/public/images/actors/jennifer_carpenter.jpg'),
    ('Jennifer', 'Connelly', 'Female', '1970-12-12', '/public/images/actors/jennifer_connelly.jpg'),
    ('Joaquin', 'Phoenix', 'Male', '1974-10-28', '/public/images/actors/joaquin_phoenix.webp'),
    ('Jodie', 'Foster', 'Female', '1962-11-19', '/public/images/actors/jodie_foster.jpg'),
    ('Johnny', 'Depp', 'Male', '1963-06-09', '/public/images/actors/johnny_depp.jpg'),
    ('Kate', 'Winslet', 'Female', '1975-10-05', '/public/images/actors/kate_winslet.jpg'),
    ('Kevin', 'Spacey', 'Male', '1959-07-26', '/public/images/actors/kevin_spacey.webp'),
    ('Kristen', 'Stewart', 'Female', '1990-04-09', '/public/images/actors/kristen_stewart.webp'),
    ('Matt', 'Damon', 'Male', '1970-10-08', '/public/images/actors/matt_damon.jpg');

INSERT INTO directors (first_name, last_name, gender, birth_date, photo_url)
VALUES 
    ('Christopher', 'Nolan', 'Male', '1970-07-30', '/public/images/directors/christopher_nolan.webp'),
    ('David', 'Fincher', 'Male', '1962-08-28', '/public/images/directors/david_fincher.jpg'),
    ('Denis', 'Villeneuve', 'Male', '1967-10-03', '/public/images/directors/denis_villeneuve.jpg'),
    ('James', 'Cameron', 'Male', '1954-08-16', '/public/images/directors/james_cameron.jpeg'),
    ('Martin', 'Scorsese', 'Male', '1942-11-17', '/public/images/directors/martin_scorsese.webp'),
    ('Quentin', 'Tarantino', 'Male', '1963-03-27', '/public/images/directors/quentin_tarantino.jpg'),
    ('Ridley', 'Scott', 'Male', '1937-11-30', '/public/images/directors/ridley_scott.jpg'),
    ('Steven', 'Spielberg', 'Male', '1946-12-18', '/public/images/directors/steven_spielberg.jpg'),
    ('Tim', 'Burton', 'Male', '1958-08-25', '/public/images/directors/tim_burton.jpg'),
    ('Ryan', 'Murphy', 'Male', '1965-11-30', '/public/images/directors/ryan_murphy.jpg'),
    ('Ingmar', 'Bergman', 'Male', '1918-07-14', '/public/images/directors/ingmar_bergman.jpg'),
    ('David', 'Lynch', 'Male', '1946-01-20', '/public/images/directors/david_lynch.jpg'),
    ('Darren', 'Aronofsky', 'Male', '1969-02-12', '/public/images/directors/darren_aronofsky.jpg'),
    ('Roman', 'Polanski', 'Male', '1933-08-18', '/public/images/directors/roman_polanski.jpg'),
    ('Peter', 'Jackson', 'Male', '1961-10-31', '/public/images/directors/peter_jackson.jpg'),
    ('Paul', 'Thomas Anderson', 'Male', '1970-06-26', '/public/images/directors/paul_thomas_anderson.jpg');
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



