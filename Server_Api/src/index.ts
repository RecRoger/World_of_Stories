import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import './database';

import userRouter from './routes/users.routes';
import citiesRouter from './routes/cities.routes';
import placesRouter from './routes/places.routes';
import npcsRouter from './routes/npcs.routes';
import chaptersRouter from './routes/chapters.routes';

// Inits
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
var allowCrossDomain = function (req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.all('/*', allowCrossDomain);

/** VISTAS DE LA API! */
// handlebars
// app.set('views', path.join(__dirname, 'views'));
// app.engine('.hbs', exphbs({
//     extname: '.hbs',
//     layoutsDir: path.join(app.get('views'), 'layouts'),
//     partialsDir: path.join(app.get('views'), 'partials'),
//     helpers: require('./lib/helpers'),
//     defaultLayout: "main"
// }));
// app.set('view engine', '.hbs');
/** OPCIONAL, REFACTORIZAR! */



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Static Files
app.use(express.static(path.join(__dirname, 'public')));



// Routes
app.use('/users', userRouter);
app.use('/cities', citiesRouter);
app.use('/places', placesRouter);
app.use('/npcs', npcsRouter);
app.use('/chapters', chaptersRouter);




// Starting the server
app.listen(app.get('port'), () => {
    console.log(`******* Aplication Start *********`);
    console.log(`Server listening on port ${app.get('port')}`);
    console.log(`**********************************`);
});


