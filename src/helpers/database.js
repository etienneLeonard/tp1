import mongoose from 'mongoose';
import chalk from 'chalk';

// Code pour accèder à la base de données
export default app => {

    const url = process.env.DATABASE;
    console.log(url);
    console.log(chalk.green(`[MONGO] - Establish new connection with url: ${url}`));
    mongoose.Promise = global.Promise;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    // connection à la base de données
    mongoose.connect(url).then(
        () => { console.log(chalk.green(`[MONGO] - Connected to: ${url}`)); }
    );
}
