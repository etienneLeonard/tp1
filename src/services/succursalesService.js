// But : Créer le service qui va faire le lien entre le models "Succursale" et sa route.
// Auteur : Gabriel Duquette Godon et Étienne Léonard
// Date : 24 septembre 2020
// Mis à jour : 29 septembre 2020

// On import le model des succursales.
import Succursale from '../models/succursale.js';
import inventairesService from '../services/inventairesService.js';

class SuccursalesService{

    create(succursale)
    {
        return Succursale.create(succursale);
    }

    // retourner une succursale par son ID
    retrieveById(succursaleId, retrieveOptions) {
        const retrieveQuery = Succursale.findById(succursaleId);
        
        if(retrieveOptions.inventaire){
            retrieveQuery.populate('inventaire');
        }

        return retrieveQuery;
    }

    async update(succursaleID, succursale){
        // On crée un filtreur.
        const filter = {_id: succursaleID};

        await Succursale.findByIdAndUpdate(filter,succursale);

        return Succursale.findOne(filter);
    }

    // permet de transformer l'envoi des données d'une succursale
    transform(succursale, transformOptions = {}) {
        const inventaire = succursale.inventaire;

        if(inventaire) {
            succursale.inventaire = { href: `${process.env.BASE_URL}/intentaires/${inventaire._id}`};
        }
        
        // Pour embed=inventaire
        if(transformOptions.embed.inventaire){
            succursale.inventaire = inventairesService.transform(inventaire);
        }

        // linking
        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;

        // Ménage de la succursale
        delete succursale._id;
        delete succursale.__v;

        return succursale;
    }
}

// On met le service Succursale à tous.
export default new SuccursalesService();