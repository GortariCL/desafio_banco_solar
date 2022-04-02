CREATE DATABASE bancosolar;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    balance INT NOT NULL CHECK (balance >= 0),
    estado BOOLEAN NOT NULL
);

CREATE TABLE transferencias (
    id SERIAL PRIMARY KEY,
    emisor INT REFERENCES usuarios(id),
    receptor INT REFERENCES usuarios(id),
    monto FLOAT,
    fecha TIMESTAMP
);
