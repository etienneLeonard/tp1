// But : Créer le service qui va faire le lien entre le models "Succursale" et sa route.
// Auteur : Gabriel Duquette Godon et Étienne Léonard
// Date : 24 septembre 2020

// On import le model des succursales.
import Succursale from '../models/succursale.js';
import inventairesService from '../services/inventairesService.js';

class SuccursalesService{

    create(succursale)
    {
        return Succursale.create(succursale);
    }

    // EL : retourner une succursale par son ID
    retrieveById(succursaleId, retrieveOptions) {
        // EL : on va chercher en BD la succursale avec ses informations par son ID
        const retrieveQuery = Succursale.findById(succursaleId, retrieveOptions.fields);
        
        // EL : si on souhaite afficher les informations de l'inventaire lié avec la succursale
        if(retrieveOptions.inventaire){
            retrieveQuery.populate('inventaire');
        }

        // EL : on retourne l'information
        return retrieveQuery;
    }

    async update(succursaleID, succursale){
        // On crée un filtreur.
        const filter = {_id: succursaleID};

        await Succursale.findByIdAndUpdate(filter,succursale);

        return Succursale.findOne(filter);
    }

    transformAjout(succursale)
    {
        const inventaire = succursale.inventaire;

        if(inventaire) {
            succursale.inventaire= { href: `${process.env.BASE_URL}/inventaires/${inventaire._id}`};
        }
        
        // EL : linking
        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;

        // EL : Ménage de la succursale
        delete succursale._id;
        delete succursale.__v;

        // EL : on retourne la succursale transformée
        return succursale;       
    }

    // EL : permet de transformer l'envoi des données d'une succursale
    transform(succursale, transformOptions = {}) {        
        const inventaire = succursale.inventaire;

        if(inventaire) {
            succursale.inventaire= { href: `${process.env.BASE_URL}/inventaires/${inventaire._id}`};
        }

        // EL : Pour embed=inventaire
        if(transformOptions.embed.inventaire){
            succursale.inventaire = inventairesService.transform(inventaire);
        }

        // EL : linking
        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;

        // EL : Ménage de la succursale
        delete succursale._id;
        delete succursale.__v;

        // EL : on retourne la succursale transformée
        return succursale;
    }
}

// On met le service Succursale à tous.
export default new SuccursalesService();