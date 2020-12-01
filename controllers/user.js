// Ajout des packages suplémentaires
const bcrypt = require('bcrypt'); //package de chiffrement
const jwt = require('jsonwebtoken');

// Import du modèle de l'utilisateur
const User = require('../models/user');

// Création d'un utilisateur non existant
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //appel de la fonction de hash bcrypt pour le mdp sur 10 passes
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Récupération d'un utilisateur déja existant dans la base de donnée
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //utilisation du modèle Mongoose pour verifier l'existance du user en base
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Oups... Utilisateur non trouvé. Veuillez créer votre compte !' });
        }
        bcrypt.compare(req.body.password, user.password) //comparaison du hash du mdp
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //utilisation de sign pour encoder un nouveau token de connection
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };