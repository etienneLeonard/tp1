// But : Programmation des routes de l'api pour les livres.
// Auteur : Étienne Léonard
// Date : 30 septembre 2020.
// Mis à jour : 30 septembre 2020

// On import les modules.
import express from 'express';
import paginate from 'express-paginate';
import { stat } from 'fs';
import error from 'http-errors';

// On import le service des succursales.
import livresService from '../services/livresService.js';

// On fait le routage.
const router = express.Router();

class LivresRoutes{
    //#region  Constructeur
    constructor(){
        router.get('/', paginate.middleware(5,6), this.getAll);
        router.get('/:idLivre', this.getOne);  // Sélection d'un livre.
        router.post('/', this.post);                // Ajouter un livre.
        router.put('/:idLivre', this.put);     // Modifier un livre.
        router.delete('/:idLivre', this.delete)
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
            // Va envoyer la bonne erreur
            return next(err);
        }
    }

    async put(req, res, next){

    }
    //#endregion

    //#region Sélection
    async getAll(req, res, next){

        const retrieveOptions = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip
        }

        try{

            let filter = {};

            // on verifie s'il y a une categorie de donnée
            if(req.query.categorie){
                filter = {categorie: `${req.query.categorie}`};
            }

            // on va récupérer les livres et le nombre de livres
            let [livres, itemsCount] = await livresService.retrieveByCriteria(filter, retrieveOptions);

            // on déclage les constantes pour le metadata
            const pageCount = Math.ceil(itemsCount / req.query.limit);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);
            
            // déclaration du responsebody
            let responseBody = {};
            
            // s'il y a juste des livres pour une seul page, alors il ne faut pas de link prev et next
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

            // s'il y a assez de livre que pour 2 pages, alors il faut qu'un self et un next
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

                // pour si nous sommes à la première page
                if(req.query.page === 1) {
                    delete responseBody._links.prev;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`;
                }
    
                // pour s'il n'y a pas de prochaine page
                if(!hasNextPage) {
                    responseBody._links.prev = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[1].url}`;
                    delete responseBody._links.next;
                }
            }
            
            // Pour s'il y a assez de livres pour plus de 3 pages
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

                // pour si nous sommes à la première page
                if(req.query.page === 1) {
                    delete responseBody._links.prev;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                    responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`;
                }
    
                // pour s'il n'y a pas de prochaine page
                if(!hasNextPage) {
                    responseBody._links.prev = `${process.env.BASE_URL}${pageArray[1].url}`;
                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[2].url}`;
                    delete responseBody._links.next;
                }
            }

            res.status(200).json(responseBody);

        }catch(err) {
            return next(err);
        }
    }

    async getOne(req, res, next){
        
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
    //#endregion
}

new LivresRoutes();

export default router;