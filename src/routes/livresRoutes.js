// But : Programmation des routes de l'api pour les livres.
// Auteur : Étienne Léonard
// Date : 30 septembre 2020.
// Mis à jour : 30 septembre 2020

// On import les modules.
import express from 'express';
import paginate from 'express-paginate';
import _ from 'lodash';
import { stat } from 'fs';
import error from 'http-errors';
const FIELDS_REGEX = new RegExp('([^,]*)');
// On import le service des succursales.
import livresService from '../services/livresService.js';
import commentaireService from '../services/commentaireService.js'
import inventaire from '../models/inventaire.js';
import { compileFunction } from 'vm';
// On fait le routage.
const router = express.Router();

class LivresRoutes{
    //#region  Constructeur
    constructor(){
        router.get('/', paginate.middleware(5,6), this.getAll);
        router.get('/:idLivre', this.getOne);  // Sélection d'un livre.
        router.post('/', this.post);                // Ajouter un livre.
        router.post('/:idLivre/commentaires',this.addCommentaire) // ED:Ajoute un commmentaire
        router.put('/:idLivre', this.put);     // Modifier un livre.
        router.delete('/:idLivre', this.delete);
    }
    //#endregion

    //#region Ajout et modification
    // EL : ajout d'un livre
    async post(req, res, next){

        // EL : on s'assure que le body n'est pas vide
        if(!req.body) {
            return next(error.BadRequest()); // EL : Erreur 400
        }

        try {
            // EL : on crée le livre avec l'information du body
            let livreAdded = await livresService.create(req.body);

            // EL : on transforme le livre en objet
            livreAdded = livreAdded.toObject({ getter: false, virtual: true});
            livreAdded = livresService.transform(livreAdded);

            // EL : on ajoute le lien du nouveau livre dans le Header
            res.header('Location', livreAdded.href);

            // EL : on retourne le nouveau livre
            res.status(201).json(livreAdded);
        } catch(err) {
            // EL : Va envoyer la bonne erreur
            return next(err);
        }
    }

    //ED:Function qui modifie un livre
    async put(req, res, next){
        //ED:Validation que la requete à un body
        if (!req.body) {
            return next(error.BadRequest());
        }

        try {
            //ED:On va Modifier le livre
            let livre = await livresService.update(req.params.idLivre, req.body);
            //ED:Si l'utilisateur souhaite ne pas avoir de retour 
            if (req.query._body === 'false') {
                //Retour avec succes et sans contenu
                res.status(200).end();
            } else {
                //ED:Préparation du livre pour l'envoi ver l'utilisateur
                livre = livre.toObject({ getter: false, virtual: true });
                livre = await livresService.transform(livre);
                console.log(livre)
                //ED:Retour avec succes et avec contenu
                res.status(200).json(livre);
            }
        } catch (err) {
            //ED:Affiche de l'erreur
            return next(error.InternalServerError(err));
        }
    }
    //#endregion

    //#region Sélection
    // EL : Sélection de tous les livres
    async getAll(req, res, next){

        // EL : on définit les informations du metadata
        const retrieveOptions = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip
        }

        try{

            let filter = {};

            // EL : on verifie s'il y a une categorie de donnée
            if(req.query.categorie){
                filter = {categorie: `${req.query.categorie}`};
            }

            // EL : on va récupérer les livres et le nombre de livres
            let [livres, itemsCount] = await livresService.retrieveByCriteria(filter, retrieveOptions);

            // EL : on déclage les constantes pour le metadata
            const pageCount = Math.ceil(itemsCount / req.query.limit);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);
            
            // EL : déclaration du responsebody
            let responseBody = {};
            
            // EL : s'il y a juste des livres pour une seul page, alors il ne faut pas de link prev et next
            if(pageCount === 1){
                responseBody = {
                    _metadata: {
                        hasNextPage: hasNextPage,
                        page: req.query.page,
                        limit: req.query.limit,
                        totalPages: pageCount,
                        totalDocument: itemsCount
                    },
                    _links: {
                        self: `${process.env.BASE_URL}${pageArray[0].url}`
                    },
                    results: livres
                };
            }

            // EL : s'il y a assez de livre que pour 2 pages, alors il faut qu'un self et un next
            if(pageCount === 2){
                responseBody = {
                    _metadata: {
                        hasNextPage: hasNextPage,
                        page: req.query.page,
                        limit: req.query.limit,
                        totalPages: pageCount,
                        totalDocument: itemsCount
                    },
                    _links: {
                        self: `${process.env.BASE_URL}${pageArray[0].url}`,
                        next: `${process.env.BASE_URL}${pageArray[1].url}`
                    },
                    results: livres
                };

                // EL : pour si nous sommes à la première page
                if(req.query.page === 1) {
                    delete responseBody._links.prev;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`;
                }
    
                // EL : pour s'il n'y a pas de prochaine page
                if(!hasNextPage) {
                    responseBody._links.prev = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[1].url}`;
                    delete responseBody._links.next;
                }
            }
            
            // EL : Pour s'il y a assez de livres pour plus de 3 pages
            if(pageCount >= 3){
                responseBody = {
                    _metadata: {
                        hasNextPage: hasNextPage,
                        page: req.query.page,
                        limit: req.query.limit,
                        totalPages: pageCount,
                        totalDocument: itemsCount
                    },
                    _links: {
                        prev: `${process.env.BASE_URL}${pageArray[0].url}`,
                        self: `${process.env.BASE_URL}${pageArray[1].url}`,
                        next: `${process.env.BASE_URL}${pageArray[2].url}`
                    },
                    results: livres
                };

                // EL : pour si nous sommes à la première page
                if(req.query.page === 1) {
                    delete responseBody._links.prev;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`;
                }
    
                // EL : pour s'il n'y a pas de prochaine page
                if(!hasNextPage) {
                    responseBody._links.prev = `${process.env.BASE_URL}${pageArray[1].url}`;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[2].url}`;
                    delete responseBody._links.next;
                }
            }

            // EL : on retourne les livres
            res.status(200).json(responseBody);

        }catch(err) {
            // EL : On retourne l'erreur 
            return next(err);
        }
    }

    //ED:Function qui va chercher un livre par son id
    async getOne(req, res, next){
        //ED:Va chercher les options demander par l'utilisateur
        const transformOptions = { embed: {} };
        const retrieveOptions = { inventaire: false};

        //ED:Validation que l'inventaire est demander dans le embed
        if(req.query.embed === 'inventaire'){
            retrieveOptions.inventaire = true;
            transformOptions.embed.inventaire = true;
        }
        //ED:Valide que l'utilisateur recherche des champs précis
        if(req.query.fields) { 
            //ED:Va chercher les champs
            let fields = req.query.fields;
            //ED:Valide le format
            if(FIELDS_REGEX.test(fields)) {
                //ED: Place dasn retrieveOption les champs demander
                fields = fields.replace(/,/g, ' ');
                retrieveOptions.fields = fields;

            } else {
                //ED:Retourne une erreur
               return next(error.BadRequest()); 
            }
        } else {
            retrieveOptions.livre = true;
        }
        try
        {
            //ED: Va chercher le livre
            let livre = await livresService.retriveById(req.params.idLivre, retrieveOptions);
            //ED:Si le livre n'existe pas 
            if (!livre) 
                //ED: retourne l'erreur
                return next(error.NotFound(`Le livre avec l'identifiant ${req.params.idLivre} n'existe pas.`));
            
            //ED: Prepare l'objet pour l'affichage
            livre = livre.toObject({ getter: false, virtuals: true });
            livre = await livresService.transform(livre);
            //ED: Declaration du responceBody 
            let responceBody ={}
            
            //ED: Valide que l'utilisateur veur savoir dans quelle inventaire ce trouve ce livre
            if(retrieveOptions.inventaire)
            {
                let filter = {livre:req.params.idLivre}
                
                //ED:Va chercher les inventaire contenant le livres 
                let inventaireContenent = await inventaire.find();
                
                let  tekm=[]
                
                inventaireContenent.forEach((val) => { 
                    if (req.params.idLivre ==val.toJSON().livre)
                    { tekm.push(val.toJSON()) ;}
                })
                
                //ED:Valide qu'aucun inventaire ne contient le livre
                if(tekm.length < 1 || inventaireContenent == undefined)
                {
            
                //ED:Modification du responce body si le livre n'est dans aucun inventaire 
                responceBody = {
                inventaire:"Présent dans aucun inventaire",
                results:livre};
                }    
                //ED: si le livre est dans un inventaire
                else
                {
                    //ED:Modification du responce body
                    responceBody = {
                        inventaire: tekm,
                        results:livre
                    };
                }                    
        }
            else 
                //ED:Modification du responce body
                responceBody = {results:livre}
            //ED:Retour avec succes et avec contenu
            res.status(200).json(responceBody);
        }
        catch(err)
        {
            //ED:Retour de l'Erreur
            return next(error.InternalServerError(err));
        }
    }

    async delete(req,res,next){
        // On essais de supprimer la planete.
        try{
            let status = await livresService.delete(req.params.idLivre);
            console.log(status);
            res.status(204).end();
        }catch(err){
            return next(error.InternalServerError(err));
        }
    }
    //ED: Funtion qui rajoute un commentaire a un livre
    async addCommentaire(req,res,next)
    {
        //ED: Valide que l'utilisateur a bien 
        if (_.isEmpty(req.body)) { //Retourne vrai sur {}
            return next(error.BadRequest()); /*Erreur 400, 415*/}
        try
        {
            //ED:Creer le commenataire
            let commentaireAdded = await commentaireService.create(req.body);
            //ED:Prepare le commentaire pour l'affichage
            commentaireAdded = commentaireAdded.toObject({ getter: false, virtual: true});
            commentaireAdded = commentaireService.transform(commentaireAdded);
            res.header('Location', commentaireAdded.href);
            //ED:Si L'utilisateur ne veut pas de retour de donner
            if (req.query._body === 'false') {
                //ED:Retour avec succes
                res.status(201).end();
            } else {
                //ED:Retour avec succes et commentaire 
                res.status(201).json(commentaireAdded);
            }
        }
        catch(err)
            //ED:retourne le l'erreur
            {return next(err);}
    }
    //#endregion
}

new LivresRoutes();

export default router;