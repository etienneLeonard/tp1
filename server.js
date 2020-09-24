import './env.js';
import chalk from 'chalk';

import app from './src/app.js';

const PORT = 5600;

app.listen(PORT, err=>{
    //Il y a eu une erreur dans le lancement du serveur
    if(err){
        process.exit(1);
    }

    //Affiche l'information que le serveur est bien actif
    console.log(chalk.blue(`Serveur en écoute sur le port: ${PORT}`));

});