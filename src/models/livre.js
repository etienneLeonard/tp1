// But : Configuer le modèle pour la classe "Livre".
// Auteur : Gabriel Duquette Godon
// Date : 24 septembre 2020
// Mis à jour : 24 septembre 2020

import mongoose from 'mongoose'

// On déclare le schéma.
const livreSchema = mongoose.Schema({
    categorie : String,
    titre : {type : String, unique : true, required: true},
    prix : {type : Number, required : true},
    auteur : {type : String, required : true},
    sujet : {type : String, required : true},
    ISBN : {type : String, required : true}
},
{
    collection : 'livres'
});

// On met le module disponible pour tous.
export default mongoose.model('Livre', livreSchema);