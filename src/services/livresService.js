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
        return Livre.findByIdAndDelete(idLivre);
    }
    //ED: permet de récupéré un livre par son Id
    retriveById(livreId,retrieveOptions)
    {

        //ED: Chercher le livre
        const retrieveQuery = Livre.findById(livreId, retrieveOptions.fields);
        if(retrieveOptions.inventaire){
            retrieveQuery.populate('inventaire');
        }
        //ED:Retourne le livre
        return retrieveQuery;
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
        livre.href = `${process.env.BASE_URL}/livres/${livre.id}`;

        // Ménage du livre
        delete livre._id;
        delete livre.__v;

        return livre;
    }
    //ED: Function qui met a jour un livre
    async update(idLivre, livre)
    {
        //ED: declarion du filtre
        const filter = { _id: idLivre };
        //ED: retourne le livre et l'update
        await Livre.findOneAndUpdate(filter, livre);//Retourne le livre avant la mise à jour
        return  this.retriveById(idLivre,{}) ;
    }
}

// On met le service Livre à tous.
export default new LivresService();