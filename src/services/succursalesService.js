// But : Crée le service qui va faire le lien entre le models "Succursale" et sa route.
// Auteur : Gabriel Duquette Godon et Étienne Léonard
// Date : 24 septembre 2020
// Mis à jour : 29 septembre 2020

// On import le model des succursales.
import Succursale from '../models/succursale.js';

class SuccursalesService{

    // retourner une succursale par son ID
    retrieveById(succursaleId) {
        return Succursale.findById(succursaleId);
    }

    // permet de transformer l'envoi des données d'une succursale
    transform(succursale, transformOptions = {}) {
        // linking
        succursale.href = `${process.env.BASE_URL}/succursales/${succursale._id}`;

        // Ménage de la succursale
        delete succursale._id;

        return succursale;
    }
}

// On met le service Succursale à tous.
export default new SuccursalesService();