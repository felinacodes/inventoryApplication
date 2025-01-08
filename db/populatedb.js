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
    ('Action'), 
    ('Comedy'),  
    ('Drama'),   
    ('Horror'),  
    ('sci-fi'),  
    ('thriller'),
    ('Crime'),
    ('Biography'),
    ('Romanace'),
    ('Adventure'),
    ('Fantasy'),
    ('Mystery');

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
    ('Matt', 'Damon', 'Male', '1970-10-08', '/public/images/actors/matt_damon.jpg'),
    ('Micheal', 'C Hall', 'Male', '1971-02-01', '/public/images/actors/Micheal_c_hall.webp'),
    ('Nicole', 'Kidman', 'Female', '1967-06-20', '/public/images/actors/nicole_kidman.jpg'),
    ('Rami', 'Malek', 'Male', '1981-05-12', '/public/images/actors/rami_malek.jpg'),
    ('Robert', 'De Niro', 'Male', '1943-08-17', '/public/images/actors/robert_de_niro.webp'),
    ('Robert', 'Pattinson', 'Male', '1986-05-13', '/public/images/actors/robert_pattinson.webp'),
    ('Ryan', 'Gosling', 'Male', '1980-11-12', '/public/images/actors/ryan_gosling.jpg'),
    ('Sarah', 'Paulson', 'Female', '1974-12-17', '/public/images/actors/sarah_paulson.jpg'),
    ('Tom', 'Hanks', 'Male', '1956-07-09', '/public/images/actors/tom_hanks.jpg');

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

INSERT INTO movies (title, year, description, photo_url)
VALUES 
    ('Inception', 2010, 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', '/public/images/movies/inception.jpg'),
    ('The Dark Knight', 2008, 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', '/public/images/movies/the_dark_knight.jpg'),
    ('Fight Club', 1999, 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', '/public/images/movies/fight_club.jpg'),
    ('Se7en', 1995, 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.', '/public/images/movies/se7en.webp'),
    ('The Shawshank Redemption', 1994, 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', '/public/images/movies/the_shawshank_redemption.webp'),
    ('Pulp Fiction', 1994, 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', '/public/images/movies/pulp_fiction.jpg'),
    ('Oppenheimer', 2023, 'A biopic of J. Robert Oppenheimer, the scientist who led the development of the atomic bomb.', '/public/images/movies/oppenheimer.jpg'),
    ('The Truman Show', 1998, 'An insurance salesman discovers his whole life is actually a reality TV show.', '/public/images/movies/the_truman_show.jpg'),
    ('Rosemary""s Baby', 1968, 'A young couple moves in to an apartment only to be surrounded by peculiar neighbors and occurrences. When the wife becomes mysteriously pregnant, paranoia over the safety of her unborn child begins to control her life.', '/public/images/movies/rosemarys_baby.jpg'),
    ('Eternal Sunshine of the Spotless Mind', 2004, 'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.', '/public/images/movies/eternal_sunshine_of_the_spotless_mind.jpg'),
    ('Pi', 1998, 'A paranoid mathematician searches for a key number that will unlock the universal patterns found in nature.', '/public/images/movies/pi.jpg'),
    ('The Platform', 2019, 'A vertical prison with one cell per level. Two people per cell. One only food platform and two minutes per day to feed from up to down. An endless nightmare trapped in The Hole.', '/public/images/movies/the_platform.jpg'),
    ('Mean Girls', 2004, 'Cady Heron is a hit with The Plastics, the A-list girl clique at her new school, until she makes the mistake of falling for Aaron Samuels, the ex-boyfriend of alpha Plastic Regina George.', '/public/images/movies/mean_girls.jpg'),
    ('Saw', 2004, 'Two strangers, who awaken in a room with no recollection of how they got there, soon discover they""re pawns in a deadly game perpetrated by a notorious serial killer.', '/public/images/movies/saw.jpg'),
    ('Orphan', 2009, 'A husband and wife who recently lost their baby adopt a 9-year-old girl who is not nearly as innocent as she appears.', '/public/images/movies/orphan.jpg'),
    ('Requiem for a Dream', 2000, 'The drug-induced utopias of four Coney Island people are shattered when their addictions run deep.', '/public/images/movies/requiem_for_a_dream.jpg'),
    ('Lord of the Rings: The Fellowship of the Ring', 2001, 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.', '/public/images/movies/lord_of_the_rings_the_fellowship_of_the_ring.webp'),
    ('Harry Potter and the Prisoner of Azkaban', 2004, 'Harry Potter, Ron and Hermione return to Hogwarts School of Witchcraft and Wizardry for their third year of study, where they delve into the mystery surrounding an escaped prisoner who poses a dangerous threat to the young wizard.', '/public/images/movies/harry_potter_and_the_prisoner_of_azkaban.jpg'),
    ('The Seventh Seal', 1957, 'A knight returning to Sweden after the Crusades seeks answers about life, death, and the existence of God as he plays chess against the Grim Reaper during the Black Plague.', '/public/images/movies/the_seventh_seal.jpg'),
    ('Inglorious Basterds', 2009, 'In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner vengeful plans for the same.', '/public/images/movies/inglorious_basterds.jpg'),
    ('The Pianist', 2002, 'A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.', '/public/images/movies/the_pianist.jpg'),
    ('The Matrix', 1999, 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', '/public/images/movies/the_matrix.jpg'),
    ('Prisoners', 2013, 'When Keller Dover""s daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts.', '/public/images/movies/prisoners.jpg'),
    ('Drive', 2011, 'A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver and finds himself in trouble when he helps out his neighbor.', '/public/images/movies/drive.jpg'),
    ('It Follows', 2014, 'A young woman is followed by an unknown supernatural force after a sexual encounter.', '/public/images/movies/it_follows.jpg'),
    ('Fargo', 1996, 'Jerry Lundegaard""s inept crime falls apart due to his and his henchmen""s bungling and the persistent police work of the quite pregnant Marge Gunderson.', '/public/images/movies/fargo.webp'),
    ('Scarface', 1983, 'In 1980 Miami, a determined criminal-minded Cuban immigrant becomes the biggest drug smuggler in the United States.', '/public/images/movies/scarface.jpg'),
    ('The Godfather', 1972, 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', '/public/images/movies/the_godfather.jpg'),
    ('The Departed', 2006, 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.', '/public/images/movies/the_departed.jpg'),
    ('Parasite', 2019, 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', '/public/images/movies/parasite.jpg'),
    ('Her', 2013, 'In the near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.', '/public/images/movies/her.jpg'),
    ('Taxi Driver', 1976, 'Travis, an ex-marine and Vietnam veteran, works as a taxi driver in New York City. One day, he decides to save an underage prostitute from her pimp in an effort to clean the city of its corruption.', '/public/images/movies/taxi_driver.jpg'),
    ('12 Angry Men', 1957, 'An eighteen-year-old Latino is accused of having stabbed his father to death. He is presented in a courtroom before a twelve-man jury. Eleven out of the twelve men vote guilty, except for Mr. Davis', '/public/images/movies/12_angry_men.jpg');

    INSERT INTO movie_actors (movie_id, actor_id) 
VALUES 
   (1,1),
   (1,11),
   (2,10),
   (2,11),
   (3,2),
   (3,18),
   (4,2),
   (7,11),
   (10,24),
   (16,18),
   (16,20),
   (18,12),
   (18,14),
   (20,2),
   (23,17),
   (24,31),
   (24,8),
   (27,4),
   (28,4),
   (29,1),
   (29,27),
   (31,21),
   (32,29),
   (32,22);

INSERT INTO movie_directors (movie_id, director_id)
VALUES
    (1,1),
    (2,1),
    (3,2),
    (4,2),
    (6,6),
    (7,1),
    (9,13),
    (11,12),
    (16,12),
    (17,14),
    (19,11),
    (20,6),
    (23,3),
    (29,5),
    (32,5);

INSERT INTO movie_genres (movie_id, genre_id)
VALUES 
    (1,1),
    (1,5),
    (2,1),
    (2,3),
    (3,3),
    (3,6),
    (4,6),
    (4,3),
    (5,3),
    (5,7),
    (6,3),
    (6,7),
    (7,3),
    (7,8),
    (8,3),
    (8,5),
    (9,4),
    (9,3),
    (10,3),
    (10,9),
    (11,3),
    (11,6),
    (12,4),
    (12,5),
    (13,2),
    (13,3),
    (14,4),
    (14,6),
    (15,4),
    (15,6),
    (16,3),
    (17,1),
    (17,10),
    (18,10),
    (18,11),
    (19,3),
    (19,11),
    (20,10),
    (20,3),
    (21,8),
    (21,3),
    (22,1),
    (22,5),
    (23,3),
    (23,6),
    (24,3),
    (24,6),
    (25,4),
    (25,12),
    (26,7),
    (26,3),
    (27,7),
    (27,3),
    (28,7),
    (28,3),
    (29,7),
    (29,3),
    (30,2),
    (30,3),
    (31,3),
    (31,9),
    (32,7),
    (32,3),
    (33,3);
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



