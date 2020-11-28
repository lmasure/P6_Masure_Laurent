const Sauces = require('../models/sauces');
const fs = require('fs');

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce crée !' }))
    .catch(error => res.status(400).json({ error }));
};

// Lecture d'une sauce avec son Id
exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id
  }).then((sauce) => { res.status(200).json(sauce); }
  ).catch((error) => { res.status(404).json({ error: error }) });
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Affichage de toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauces.find()
    .then((sauce) => { res.status(200).json(sauce); })
    .catch((error) => { res.status(400).json({ error: error }) });
};

exports.like = (req, res, next) => {
  switch (req.body.like) {
// suppression de la valeur par défaut 0 puis ajoute un like ou dislike
    case 0:
      Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauces.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 }, // incrémente un like
              $pull: { usersLiked: req.body.userId }, // l'opérateur supprime le like
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Avis enregistré' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauces.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Avis enregistré' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    // si la valeur du like est à 1
    case 1:
      Sauces.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Like ajouté' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;

    case -1:
      Sauces.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Dislike ajouté' }) })
        .catch((error) => { res.status(400).json({ error: error }) });
      break;
    default:
      console.error('Bad request')
  }
};
