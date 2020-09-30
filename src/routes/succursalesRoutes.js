// But : Programmation des routes de l'api pour les succursales.
// Auteur : Gabriel Duquette Godon et Étienne Léonard
// Date : 24 septembre 2020.
// Mis à jour : 29 septembre 2020

// On import les modules.
import express from 'express';
import error from 'http-errors';

// On import le service des succursales.
import succursalesService from '../services/succursalesService.js';

// On fait le routage.
const router = express.Router();

class SuccursalesRoutes{
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
        try{
            let succursale = await succursalesService.retrieveById(req.params.idSuccursale);
            succursale = succursale.toObject({ getter: false, virtual: true });
            succursale = succursalesService.transform(succursale);
            res.status(200).json(succursale);
        }catch(err){
            // Ici il n'a pas trouvé la succursale, donc on utilise le code d'erreur 404
            return next(error.NotFound());
        }
    }
    //#endregion
}

new SuccursalesRoutes();

export default router;