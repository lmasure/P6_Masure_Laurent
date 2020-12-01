// Ajout des modules dont nous avons besoins
const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');
const path = require('path');
const helmet = require("helmet");
const xss = require('xss-clean') //prévient le cross-site scripting (injection de script)

// Connexion à MongoDb et config DOTENV pour masquer les id 
require('dotenv').config();
const ID = process.env.ID;
const PSW = process.env.PSW;
mongoose.connect(`mongodb+srv://${ID}:${PSW}@sopekocko.tjpd0.mongodb.net/sopekocko?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Accès control pour éviter les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet());
app.use(bodyParser.json());

// Enregistrement des routeurs
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes, xss());
app.use('/api/auth', userRoutes, xss());

module.exports = app;