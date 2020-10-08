import livre from '../models/livre.js';
// But : Créer le service qui va faire le lien entre le models "Livre" et sa route.
// Auteur : Étienne Léonard
// Date : 30 septembre 2020
// Mis à jour : 30 septembre 2020

// On import le model des livres.
import Livre from '../models/livre.js';

class LivresService{

    // permet de créer un livre
    create(livre){
        return Livre.create(livre);
    }

    delete(idLivre)
    {
        const filter = {_id: idLivre};

        return Livre.deleteOne(filter);

    }

    // permet de récupérer tous les livres avec une metadata
    retrieveByCriteria(filter, retrieveOptions) {
        const limit = retrieveOptions.limit;
        const skip = retrieveOptions.skip;
        const retrieveQuery = Livre.find(filter).skip(skip).limit(limit);
        const countQuery = Livre.countDocuments(filter);

        return Promise.all([retrieveQuery, countQuery]);
    }

    // permet de transformer l'envoi des données d'un livre
    transform(livre, transformOptions = {}) {
        // linking
        livre.href = `${process.env.BASE_URL}/livres/${livre._id}`;

        // Ménage du livre
        delete livre._id;
        delete livre.__v;

        return livre;
    }
}

// On met le service Livre à tous.
export default new LivresService();