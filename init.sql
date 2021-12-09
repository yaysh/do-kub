CREATE DATABASE test;
CREATE USER testuser WITH PASSWORD 'testpassword';
\connect test;
CREATE TABLE messages(message_id serial PRIMARY KEY, message VARCHAR (250) NOT NULL);
GRANT ALL PRIVILEGES ON DATABASE test to testuser;
GRANT USAGE ON SEQUENCE messages_message_id_seq TO testuser;
GRANT ALL ON messages to testuser;