// But : Créer l'endroit où pouvoir accéder à toutes les routes possibles du serveur.
// Auteur : Etienne Leonard
// Date : 23 septembre 2020
// Mis à jour : 29 septembre 2020

import express from 'express';

import database from './helpers/database.js'
import errors from './helpers/errors.js';

import succursalesRoutes from './routes/succursalesRoutes.js'

const app = express();

database(app);

//Pour comprendre le json
app.use(express.json());

//route de test voir si le serveur fonctionne
app.get('/test', (req, res, next) =>{
    res.status(200); //200 = OK
    res.set('Content-Type', 'text/plain'); // format text
    res.send('Test du serveur');
});

// Ajout des routes présentes dans SuccursalesRoutes dans notre serveur
app.use('/succursales', succursalesRoutes);

errors(app);

export default app;