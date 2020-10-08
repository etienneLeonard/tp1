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
        // Si le corps de la requête est vide, fait ceci.
        if(!req.body)
            return next(error.BadRequest());    // Erreur 400, 4015

        try{
            // On crée une nouvelle succursale par le service.
            let succursaleAjout = await succursalesService.create(req.body);

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
        if(!req.body)
            return next(error.BadRequest());
        
        // On regarde s'il a un problème a faissant la modification.
        try{
            let succursale = await succursalesService.put(req.params.idSuccursale, req.body);

            if(req.query._body === 'false'){
                res.status(200).end();
            }else{
                succursale = succursale.toObject({getter:false, virtual:true});

                succursale = succursalesService.transform(succursale);
                res.status(200).json(succursale);
            }
        }catch(err){
            return next(error.InternalServerError(err));
        }
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
            // Va envoyer la bonne erreur
            return next(err);
        }
    }
    //#endregion
}

new SuccursalesRoutes();

export default router;