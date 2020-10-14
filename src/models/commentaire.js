// But : Configuer le modèle pour la classe "commentaires".
// Auteur : Gabriel Duquette Godon
// Date : 24 septembre 2020
// Mis à jour : 24 septembre 2020

import mongoose from 'mongoose'

// On déclare le schéma.
const commentaireSchema = mongoose.Schema({
    dateCommentaire : {type : Date, required : true},
    message : {type : String, required : true},
    etoile : Number
},
{
    collection : 'commentaires'
});

// On fait le lien avec le livre 
commentaireSchema.virtual('livres', {
    ref: 'Livre',
    localField: '_id',
    foreignField: 'commentaire',
    justOne: false
});

export default mongoose.model('Commentaire', commentaireSchema);