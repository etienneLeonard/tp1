// But : Programmation des routes de l'api pour les livres.
// Auteur : Étienne Léonard
// Date : 30 septembre 2020.
// Mis à jour : 30 septembre 2020

// On import les modules.
import express from 'express';
import paginate from 'express-paginate';
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
            skip: req.query.skip
        }

        try{
            let [livres, itemsCount] = await livresService.retrieveByCriteria({}, retrieveOptions);

            const pageCount = Math.ceil(itemsCount / req.query.limit);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);

            const responseBody = {
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

            if(req.query.page === 1) {
                // TODO: Quoi faire avec les links
            }

            if(!hasNextPage) {
                // TODO: Quoi faire avec les links
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
            let status = livresService.delete(req.params.idLivre);
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