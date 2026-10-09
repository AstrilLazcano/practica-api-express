-- Script de creación de la base de datos api_practica
-- Práctica 2 Unidad 2

CREATE DATABASE IF NOT EXISTS api_practica
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE api_practica;

CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo
INSERT INTO libros (nombre, autor) VALUES
  ('Cien años de soledad', 'Gabriel García Márquez'),
  ('1984', 'George Orwell'),
  ('El principito', 'Antoine de Saint-Exupéry');