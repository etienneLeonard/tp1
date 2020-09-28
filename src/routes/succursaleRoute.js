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
        // Si le corps de la requête est vide, fait ceci.
        if(!req.body)
            return next(error.BadRequest());    // Erreur 400, 4015

        try{
            // On crée une nouvelle succursale par le service.
            let succursaleAjout = await succursaleService.create(req.body);

            // On crée les paramètes de la requête.
            succursaleAjout = succursaleAjout.toObjet({getter : false, virtual : true});
            succursaleAjout = succursaleAjout.transform(succursaleAjout);

            // On dit la position de la succursale.
            res.header('Location', succursaleAjout.href);

            // Si la succursale est mal inséré, tu envoie une error 201é.
            if(req.query._body === 'false')
                res.status(201).end;
            else
                res.status(201).json(succursaleAjout);
                
        }catch(err){
            // On fait la gestion des erreurs "Mongo".
            if(err.name === "MongoError"){
                switch(err.code){
                    case 1110:
                        return next(error.Conflict(err));
                }
            }else if(err.message.incluse("Succursale validation")){
                return next(error.PreconditionFailed(err))
            }

            return next(error.InternalServerError(err));
        }
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