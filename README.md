CREATE USER tourguide WITH PASSWORD 'tourguide';

CREATE DATABASE tourguide;


CREATE TABLE myData(
	uid serial PRIMARY KEY,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	age VARCHAR ( 50 ) NOT NULL,
	created_on TIMESTAMP NOT NULL,
        last_login TIMESTAMP
);
