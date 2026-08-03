const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Activer CORS
app.use(cors());

// Servir les fichiers statiques de React (le dossier build)
app.use(express.static(path.join(__dirname, 'build')));

// Configuration de json-server pour l'API
const router = jsonServer.router(path.join(__dirname, 'backend', 'base.json'));
const middlewares = jsonServer.defaults();

// On préfixe l'API par /api
app.use('/api', middlewares, router);

// Pour toutes les autres requêtes, on renvoie le fichier index.html de React (gestion du routage côté client)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});
