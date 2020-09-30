// But : Programmation des routes de l'api pour les livres.
// Auteur : Étienne Léonard
// Date : 30 septembre 2020.
// Mis à jour : 30 septembre 2020

// On import les modules.
import express from 'express';
import error from 'http-errors';

// On import le service des succursales.
import livresService from '../services/livresService.js';

// On fait le routage.
const router = express.Router();

class LivresRoutes{
    //#region  Constructeur
    constructor(){
        router.get('/:idLivre', this.getOne);  // Sélection d'un livre.
        router.post('/', this.post);                // Ajouter un livre.
        router.put('/:idLivre', this.put);     // Modifier un livre.
    }
    //#endregion

    //#region Ajout et modification
    async post(req, res, next){

        if(!req.body) {
            return next(error.BadRequest()); //Erreur 400
        }

        try {
            let livreAdded = await livresService.create(req.body);
            livreAdded = livreAdded.toObject({ getter: false, virtual: true});
            livreAdded = livresService.transform(livreAdded);

            res.header('Location', livreAdded.href);
            res.status(201).json(livreAdded);
        } catch(err) {
            // TODO: Trouver la bonne erreur
            console.log(err);
            //Gestion des erreurs Mongo
            if(err.name === 'MongoError') {
                switch(err.code) {
                    case 11000:
                        // Si une valeur est déjà présente, on utilise le code d'erreur 409
                        return next(error.Conflict(err));
                }
            } else if(err.message.includes('Livre validation')) {
                // Si le livre ne respecte pas les conditions, on utilise le code d'erreur 412 
                return next(error.PreconditionFailed(err));
            }
            // Pour si c'est une autre erreur
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

new LivresRoutes();

export default router;