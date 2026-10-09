// index.js
require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor en línea ✅ (conectado a MySQL)');
});

// ==========================================
// GET /api/recursos - Obtener todos los libros
// ==========================================
app.get('/api/recursos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM libros');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los libros', error: error.message });
  }
});

// ==========================================
// GET /api/recursos/:id - Obtener un libro por ID
// ==========================================
app.get('/api/recursos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar el libro', error: error.message });
  }
});

// ==========================================
// POST /api/recursos - Crear un nuevo libro
// ==========================================
app.post('/api/recursos', async (req, res) => {
  try {
    const { nombre, autor } = req.body;
    if (!nombre || !autor) {
      return res.status(400).json({ mensaje: 'nombre y autor son obligatorios' });
    }
    const [result] = await db.query(
      'INSERT INTO libros (nombre, autor) VALUES (?, ?)',
      [nombre, autor]
    );
    const [nuevo] = await db.query('SELECT * FROM libros WHERE id = ?', [result.insertId]);
    res.status(201).json(nuevo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el libro', error: error.message });
  }
});

// ==========================================
// PUT /api/recursos/:id - Actualizar un libro
// ==========================================
app.put('/api/recursos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, autor } = req.body;

    const [existe] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }

    await db.query(
      'UPDATE libros SET nombre = ?, autor = ? WHERE id = ?',
      [nombre || existe[0].nombre, autor || existe[0].autor, id]
    );

    const [actualizado] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
    res.status(200).json(actualizado[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el libro', error: error.message });
  }
});

// ==========================================
// DELETE /api/recursos/:id - Eliminar un libro
// ==========================================
app.delete('/api/recursos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [existe] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }
    await db.query('DELETE FROM libros WHERE id = ?', [id]);
    res.status(200).json({ mensaje: 'Recurso eliminado', libro: existe[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el libro', error: error.message });
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
