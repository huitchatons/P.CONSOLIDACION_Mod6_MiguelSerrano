const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta para listar todos los animes
app.get('/animes', (req, res) => {
  fs.readFile('anime.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo' });
    res.json(JSON.parse(data));
  });
});

// Ruta para obtener un anime por ID
app.get('/animes/:id', (req, res) => {
  const animeId = req.params.id;
  fs.readFile('anime.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo' });
    const animes = JSON.parse(data);
    const anime = animes[animeId];
    if (!anime) return res.status(404).json({ error: 'Anime no encontrado' });
    res.json(anime);
  });
});

// Ruta para crear un nuevo anime
app.post('/animes', (req, res) => {
  fs.readFile('anime.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo' });
    const animes = JSON.parse(data);
    const newId = (Object.keys(animes).length + 1).toString();
    animes[newId] = req.body;
    fs.writeFile('anime.json', JSON.stringify(animes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar el archivo' });
      res.status(201).json(animes[newId]);
    });
  });
});

// Ruta para actualizar un anime por ID
app.put('/animes/:id', (req, res) => {
  const animeId = req.params.id;
  fs.readFile('anime.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo' });
    const animes = JSON.parse(data);
    if (!animes[animeId]) return res.status(404).json({ error: 'Anime no encontrado' });
    animes[animeId] = { ...animes[animeId], ...req.body };
    fs.writeFile('anime.json', JSON.stringify(animes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar el archivo' });
      res.json(animes[animeId]);
    });
  });
});

// Ruta para eliminar un anime por ID
app.delete('/animes/:id', (req, res) => {
  const animeId = req.params.id;
  fs.readFile('anime.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo' });
    const animes = JSON.parse(data);
    if (!animes[animeId]) return res.status(404).json({ error: 'Anime no encontrado' });
    delete animes[animeId];
    fs.writeFile('anime.json', JSON.stringify(animes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar el archivo' });
      res.status(204).send();
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
