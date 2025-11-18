// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const app = express();
const port = 3000;

// --- RUTA CORRECTA AL FRONTEND ---
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');

// --- LiveReload (opcional) ---
const liveReloadServer = livereload.createServer({ port: 35729 });
liveReloadServer.watch(FRONTEND_PATH);  // ahora apunta al frontend real
app.use(connectLiveReload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => liveReloadServer.refresh("/"), 100);
});

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_PATH)); // sirve archivos del frontend

// --- MySQL ---
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'juego_zombie_db'
});

conexion.connect(err => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err);
    return;
  }
  console.log('✅ Conexión a MySQL exitosa');
});

// --- ENDPOINTS ---
app.get('/api/clases', (req, res) => {
  conexion.query('SELECT id_clase, nombre_clase FROM clase;', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/habilidades', (req, res) => {
  conexion.query('SELECT id_habilidad, nombre_habilidad, descripcion_habilidad FROM habilidad;', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/relation3', (req, res) => {
  conexion.query('SELECT clase_id_clase, habilidad_id_habilidad FROM relation_3;', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/clases-con-habilidades', (req, res) => {
  const sql = `
    SELECT c.id_clase, c.nombre_clase,
           h.id_habilidad, h.nombre_habilidad, h.descripcion_habilidad
    FROM clase c
    JOIN relation_3 r ON c.id_clase = r.clase_id_clase
    JOIN habilidad h ON r.habilidad_id_habilidad = h.id_habilidad
    ORDER BY c.id_clase, h.id_habilidad;
  `;
  conexion.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = [];
    const map = new Map();

    rows.forEach(r => {
      if (!map.has(r.id_clase)) {
        const cls = {
          id_clase: r.id_clase,
          nombre_clase: r.nombre_clase,
          habilidades: []
        };
        map.set(r.id_clase, cls);
        grouped.push(cls);
      }
      map.get(r.id_clase).habilidades.push({
        id_habilidad: r.id_habilidad,
        nombre_habilidad: r.nombre_habilidad,
        descripcion_habilidad: r.descripcion_habilidad
      });
    });

    res.json(grouped);
  });
});

// --- Ruta principal ---
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

// --- Iniciar servidor ---
app.listen(port, () => {
  console.log(`🚀 Servidor Express en http://localhost:${port}`);
});
