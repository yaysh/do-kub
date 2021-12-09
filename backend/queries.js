const { response } = require("express");
const { Pool } = require("pg");

const credentials = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
};
const pool = new Pool(credentials);

const getMessages = (request, response) => {
    pool.query('SELECT * FROM messages LIMIT 100;', (error, results) => {
        if (error)
            response.status(400).json({ error: error.toString() });
        else
            response.status(200).json(results.rows)
    });
}

const createMessage = (request, response) => {
    const { message } = request.body;
    pool.query('INSERT INTO messages (message) VALUES ($1) RETURNING *;', [message], (error, result) => {
        if (error)
            response.status(400).json({ error: error.toString() });
        else
            response.status(201).json(result.rows[0]);
    });
}

module.exports = {
    getMessages,
    createMessage,
}