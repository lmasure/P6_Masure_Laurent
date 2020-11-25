const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//schéma utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//evite qu'on puisse s'enregistrer avec le meme email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
