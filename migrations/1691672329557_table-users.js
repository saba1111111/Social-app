/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.sql(`
       CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         username VARCHAR(20) NOT NULL,
         email VARCHAR(100) NOT NULL,
         password VARCHAR(255) NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         update_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         authorized BOOLEAN DEFAULT false NOT NULL
       );
    `);
};

exports.down = (pgm) => {
	pgm.sql(`
       DROP TABLE users;
    `);
};

// npm run migrate create table xxxe up

// DATABASE_URL=postgres://postgres:postgres123@localhost:5432/app npm run migrate up
