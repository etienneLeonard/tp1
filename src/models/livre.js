// But : Configuer le modèle pour la classe "Livre".
// Auteur : Gabriel Duquette Godon
// Date : 24 septembre 2020
// Mis à jour : 24 septembre 2020

import mongoose from 'mongoose';

// On déclare le schéma.
const livreSchema = mongoose.Schema({
    categorie : String,
    titre : {type : String, unique : true, required: true},
    prix : {type : Number, required : true},
    auteur : {type : String, required : true},
    sujet : {type : String, required : true},
    ISBN : {type : String, unique : true, required : true, validate:{
            // Valide le code ISBN du livre
            validator: function(l){
                return /978-\d{1}-\d{4}-\d{4}-\d{1}/.test(l);
            },
             message: props => `${props.value} n'est pas un code ISBN valide.`
            }},
},
{
    collection : 'livres'
});

livreSchema.virtual('inventaires', {
    ref: 'Inventaire',
    localField: '_id',
    foreignField: 'livre',
    justOne : false
})

// On met le module disponible pour tous.
export default mongoose.model('Livre', livreSchema);