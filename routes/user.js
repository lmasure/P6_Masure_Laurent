const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const rateLimit = require("express-rate-limit");

///// Routes pour l'utilisateur
router.post('/signup', userCtrl.signup);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // maximum de 10 requêtes
  });
  
router.post('/login', limiter, userCtrl.login);

module.exports = router;


