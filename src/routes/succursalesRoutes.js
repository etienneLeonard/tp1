// But : Programmation des routes de l'api pour les succursales.
// Auteur : Gabriel Duquette Godon et Étienne Léonard
// Date : 24 septembre 2020.
// Mis à jour : 29 septembre 2020

// On import les modules.
import express from 'express';
import error from 'http-errors';

// On import le service des succursales.
import succursalesService from '../services/succursalesService.js';

const FIELDS_REGEX = new RegExp('([^,]*)');

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
            succursaleAjout = succursaleAjout.toObject({getter : false, virtual : true});
            succursaleAjout = succursalesService.transformAjout(succursaleAjout);

            // On dit la position de la succursale.
            res.header('Location', succursaleAjout.href);

            // Si la succursale est mal inséré, tu envoie une error 201é.
            if(req.query._body === 'false')
                res.status(201).end;
            else
                res.status(201).json(succursaleAjout);
                
        }catch(err){
            return next(error.InternalServerError(err));
        }
    }

    async put(req, res, next){
        if(!req.body)
        {
            return next(error.BadRequest());           
        }

        // On regarde s'il a un problème a faissant la modification.
        try{
            let succursale = await succursalesService.update(req.params.idSuccursale, req.body);

            if(req.query._body === 'false'){
                res.status(200).end();
            }else{
                succursale = succursale.toObject({getter:false, virtual:true});

                succursale = succursalesService.transformAjout(succursale);
                res.status(200).json(succursale);
            }
        }catch(err){
            return next(error.InternalServerError(err));
        }
    }
    //#endregion

    //#region Sélection
    async getOne(req, res, next){
        const transformOption = { embed: {} };
        const retrieveOptions = { inventaire: false};

        // EL : Embed=inventaire
        if(req.query.embed === 'inventaire'){
            retrieveOptions.inventaire = true;
            transformOption.embed.inventaire = true;
        }

        // EL : On vérifie s'il y a un field de spécifier
        if(req.query.fields) { 
            // EL : ici il y a un field(s) de spécifié(s)
            let fields = req.query.fields;
            if(FIELDS_REGEX.test(fields)) {
                fields = fields.replace(/,/g, ' ');

                // EL : on garde en mémoire le(s) field(s) spécifié(s)
                retrieveOptions.fields = fields;
            } else {
               return next(error.BadRequest()); 
            }
        } else {
            retrieveOptions.planet = true;
        }

        try{
            // EL : on va récupérer une succursale par son id avec les options
            let succursale = await succursalesService.retrieveById(req.params.idSuccursale, retrieveOptions);

             // EL : on transforme la succursale en objet
            succursale = succursale.toObject({ getter: false, virtuals: true });
            succursale = succursalesService.transform(succursale, transformOption, retrieveOptions);

            // EL : on retourne la succursale avec ses informations
            res.status(200).json(succursale);
        }catch(err){
            // EL : Va envoyer la bonne erreur
            return next(err);
        }
    }
    //#endregion
}

new SuccursalesRoutes();

export default router;