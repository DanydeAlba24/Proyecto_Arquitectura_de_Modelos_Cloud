CREATE DATABASE IF NOT EXISTS recursos_humanos;

USE recursos_humanos;

CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL,
    email VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    number VARCHAR(100) NOT NULL
);