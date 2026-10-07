// 1. Importar Express
const express = require('express');
const app = express();
const PORT = 3000;

// 2. Middleware para parsear JSON
app.use(express.json());

// 3. Arreglo en memoria (entidad: catálogo de libros)
let libros = [
  { id: 1, nombre: 'Cien años de soledad', autor: 'Gabriel García Márquez' },
  { id: 2, nombre: '1984', autor: 'George Orwell' },
  { id: 3, nombre: 'El principito', autor: 'Antoine de Saint-Exupéry' }
];

// Variable para IDs dinámicos
let nextId = 4;

// 4. Ruta base
app.get('/', (req, res) => {
  res.send('Servidor en línea ✅');
});

// 5. GET /api/recursos - Devuelve todos los libros
app.get('/api/recursos', (req, res) => {
  res.status(200).json(libros);
});

// 6. GET /api/recursos/:id - Devuelve un libro por ID
app.get('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const libro = libros.find(l => l.id === id);
  if (!libro) {
    return res.status(404).json({ mensaje: 'Recurso no encontrado' });
  }
  res.status(200).json(libro);
});

// 7. POST /api/recursos - Crea un nuevo libro
app.post('/api/recursos', (req, res) => {
  const { nombre, autor } = req.body;
  const nuevoLibro = { id: nextId++, nombre, autor };
  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});

// 8. PUT /api/recursos/:id - Actualiza un libro
app.put('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const libro = libros.find(l => l.id === id);
  if (!libro) {
    return res.status(404).json({ mensaje: 'Recurso no encontrado' });
  }
  libro.nombre = req.body.nombre || libro.nombre;
  libro.autor = req.body.autor || libro.autor;
  res.status(200).json(libro);
});

// 9. DELETE /api/recursos/:id - Elimina un libro
app.delete('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = libros.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ mensaje: 'Recurso no encontrado' });
  }
  const eliminado = libros.splice(index, 1);
  res.status(200).json({ mensaje: 'Recurso eliminado', libro: eliminado[0] });
});

// 10. Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});