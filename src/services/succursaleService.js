// But : Crée le service qui va faire le lien entre le models "Succursale" et sa route.
// Auteur : Gabriel Duquette Godon
// Date : 24 septembre 2020
// Mis à jour : 24 septembre 2020

// On import le model des livres.
import Succursale from '../models/succursale.js';

class SuccursaleService{
    create(succursale)
    {
        return Succursale.create(succursale);
    }
}

// On met le service livre a tous.
export default new SuccursaleService();