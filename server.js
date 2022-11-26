import 'dotenv/config';
import express, { json, request, response } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import { addUtilisateur } from './model/utilisateur.js';
import { addCours, checkCours, deleteActivity, getCoursInscritServer, desincrireActivity, inscriptionActivity, getCoursNonInscritServer, getCoursServeur } from './model/methodeServeur.js';
import { validationForm } from './validation.js'
import './authentification.js';


// Création du serveur web
let app = express();

//Creation de l'engine dans Express
app.engine('handlebars', engine());

//Mettre l'engine handlebars comm engin de rendu
app.set('view engine', 'handlebars');

//Confuguration de handlebars
app.set('views', './views');

// Créer le constructeur de base de données
const MemoryStore = memorystore(session);

// Ajout de middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// Programmation de routes
app.get('/', async (request, response) => {
    response.render('accueil', {
        titre: 'BLAK.inc',
        h1: 'BLAK.inc',
        styles: ['/css/general.css'],
        scripts: ['/js/accueil.js'],
    });

});

app.get('/admin', async (request, response) => {
    response.render('admin', {
        titre: 'BLAK.inc',
        h1: 'BLAK.inc',
        styles: ['/css/general.css'],
        scripts: ['/js/admin.js'],
        cours: await getCoursServeur()
    });
});


app.get('/cours', async (request, response) => {
    response.render('cours', {
        titre: 'BLAK.inc',
        h1: 'BLAK.inc',
        styles: ['/css/general.css'],
        scripts: ['/js/cours.js'],
        cours: await getCoursNonInscritServer()
    });
})

app.get('/compte', async (request, response) => {
    response.render('compte', {
        titre: 'BLAK.inc',
        h1: 'BLAK.inc',
        styles: ['/css/general.css'],
        scripts: ['/js/compte.js'],
        compte: await getCoursInscritServer()
    });

})

app.get('/inscription', (request, response) => {
    response.render('authentification', {
        titre: 'Inscription',
        scripts: ['/js/inscription.js'],
        accept: request.session.accept,
    });
})

app.get('/connexion', (request, response) => {
    response.render('authentification', {
        titre: 'Connexion',
        scripts: ['/js/connexion.js'],
        accept: request.session.accept,
    });
})

app.post('/api/admin', async (request, response) => {
    let id = await addCours(request.body.nom, request.body.date_debut, request.body.nb_cours, request.body.capacite, request.body.description);
    response.status(201).json({ id: id });
});

app.post('/api/adminvalidation', async (request, response) => {
    if (validationForm(request.body)) {
        let id = await addCours(request.body.nom, request.body.date_debut, request.body.nb_cours, request.body.capacite, request.body.description);
        console.log(request.body);
        response.status(200).json({ id: id });
    }
    else {
        console.log(request.body);
        response.status(400).end();
    }
});

app.patch('/api/admin', async (request, response) => {
    await checkCours(request.body.id);
    response.status(200).end();
});

app.patch('/compte', async (request, response) => {
    await checkCours(request.body.id);
    response.status(200).end();

});

app.delete('/api/cours', async (request, response) => {

    let changes = await deleteActivity(request.body.id_cours);
    response.status(200).json({ changes: changes });
});

app.post('/api/cours', async (request, response) => {

    let id = await inscriptionActivity(request.body.id_cours, request.body.id_utilisateur);
    response.status(200).json({ id: id });

});

app.delete('/api/compte', async (request, response) => {

    await desincrireActivity(request.body.id_cours, request.body.id_utilisateur);

    response.status(200).end();

});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);
