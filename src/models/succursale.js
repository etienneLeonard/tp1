// But : Configuer le modèle pour la classe "Inventaire".
// Auteur : Gabriel Duquette Godon
// Date : 24 septembre 2020
// Mis à jour : 24 septembre 2020

import mongoose from 'mongoose'

// On déclare le schéma.
const succursaleSchema = mongoose.Schema({
    appelatif : {type : String, unique : true, required : true},
    adresse : {type : String, required : true},
    ville : {type : String, required : true},
    codePostal : {type : String, required : true},
    province : {type : String, required : true},
    telephone : {type : String, required : true},
    telecopieur : {type : String, required : true},
    information : {type : String, required : true},
    inventaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventaite',
        required: true
    }
},{
    collection:'succursales'
});

export default mongoose.model('Succursale', succursaleSchema);