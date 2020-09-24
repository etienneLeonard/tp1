import express from 'express';

import database from './helpers/database.js'
import errors from './helpers/errors.js';

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

errors(app);

export default app;