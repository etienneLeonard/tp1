// But : Configuer le modèle pour la classe "Inventaire".
// Auteur : Gabriel Duquette Godon
// Date : 24 septembre 2020
// Mis à jour : 24 septembre 2020

import mongoose from 'mongoose'

// On déclare le schéma.
const inventaireSchema = mongoose.Schema({
    quantite : {type : Number, required : true},
    dateDerniereReception : {type : Date, required : true},
    dateDerniereVente : {type : Date, required : true}    
})