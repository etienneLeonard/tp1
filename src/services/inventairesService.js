// But : Créer le service qui va faire le lien entre le models "Inventaire" et sa route.
// Auteur : Étienne Léonard
// Date : 10 octobre 2020

// On import le model des inventaires.
import Inventaire from '../models/inventaire.js';

class InventairesService{
    transform(inventaire){

        inventaire.href = `${process.env.BASE_URL}/inventaires/${inventaire._id}`;
        inventaire.livre = `${process.env.BASE_URL}/livres/${inventaire.livre}`;
        inventaire.succursale = `${process.env.BASE_URL}/succursales/${inventaire.succursale}`;

        delete inventaire._id;
        delete inventaire.__v;

        return inventaire;
    }
}

// On met le service Inventaire à tous.
export default new InventairesService();