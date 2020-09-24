// But : Programmation des routes de l'api pour les succursales.
// Auteur : Gabriel Duquette Godon
// Date : 24 septembre 2020.
// Mis à jour : 24 septembre 2020

// On import les modules.
import express from 'express';
import error from 'http-errors';
import succursale from '../models/succursale.js';

// On import le service des succursales.
import succursaleService from '../services/succursaleService.js';


// On fait le routage.
const router = express.Router();

class SuccursaleRoutes{
    //#region  Constructeur
    constructor(){
        router.get('/:idSuccursale', this.getOne);  // Sélection d'une succursale.
        router.post('/', this.post);                // Ajouter une succursale.
        router.put('/:idSuccursale', this.put);     // Modifier une succursale.
    }
    //#endregion

    //#region Ajout et modification
    async post(req, res, next){

    }

    async put(req, res, next){

    }
    //#endregion

    //#region Sélection
    async getOne(req, res, next){

    }
    //#endregion
}

new SuccursaleRoutes();

export default router;