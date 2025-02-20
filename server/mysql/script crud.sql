CREATE DATABASE empleados_crud;
USE empleados_crud;

CREATE TABLE empleados(
	id INT PRIMARY KEY auto_increment,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    pais VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
	anios INT NOT NULL
);

ALTER TABLE empleados
ADD COLUMN puntoA VARCHAR(255) NOT NULL,
ADD COLUMN puntoB VARCHAR(255) NOT NULL,
ADD COLUMN distancia VARCHAR(100) NOT NULL,
ADD COLUMN tiempo VARCHAR(100) NOT NULL;

INSERT INTO empleados (nombre, edad, pais, cargo, anios)
VALUES ('Erick Contreras', 29, 'Guatemala', 'Desarrollador JR', 1);

SELECT * FROM empleados;

INSERT INTO empleados (nombre, edad, pais, cargo, anios)
VALUES ('Samuel Solares', 22, 'España', 'Médico Cirujano', 1);

INSERT INTO empleados (nombre, edad, pais, cargo, anios,puntoA, puntoB, distancia, tiempo)
VALUES ('Karla Martinez', 36, 'Ecuador', 'Enfermero', 4, 'El Frutal', 'Zona 10 Mixco', '8 Kilometros', '50 min');

