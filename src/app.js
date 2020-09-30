// But : Créer l'endroit où pouvoir accéder à toutes les routes possibles du serveur.
// Auteur : Etienne Leonard
// Date : 23 septembre 2020
// Mis à jour : 29 septembre 2020

import express from 'express';

import database from './helpers/database.js';
import errors from './helpers/errors.js';

import succursalesRoutes from './routes/succursalesRoutes.js';
import livresRoutes from './routes/livresRoutes.js';

const app = express();

database(app);

//Pour comprendre le json
app.use(express.json());

// Ajout des routes présentes dans SuccursalesRoutes dans notre serveur
app.use('/succursales', succursalesRoutes);
app.use('/livres', livresRoutes);
errors(app);

export default app;