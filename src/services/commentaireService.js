// But : Créer le service qui va faire le lien entre le models "commentaire" et sa route.
// Auteur : Etienne Desrochers
// Date : 12 octobre 2020
// Mis à jour : 12 octobre 2020
import Commentaire from '../models/commentaire.js'

class CommentaireService
{
    //Function qui creer un commentarie
    create(commentaires) {
        //retourne le commentaire creer
        return Commentaire.create(commentaires);
    }

    //Function qui transforme un commentaire
    transform(commentaire)
    {
        //Donne le lien du commentaire a son objet
        commentaire.href = `${process.env.BASE_URL}/commentaire/${commentaire._id}`;
        //Suprime les champs _id et _v
        delete commentaire._id;
        delete commentaire.__v;
        //Retourne le commentarie tranformer
        return commentaire;
    }
}
export default new CommentaireService();