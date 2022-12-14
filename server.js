import 'dotenv/config';
import https from 'https';
import { readFile } from 'fs/promises';
import express, { json, request, response } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middlewareSse.js';
import { addCours, deleteActivity, getCoursInscritServer, desincrireActivity, inscriptionActivity, getCoursNonInscritServer, getCoursServeur, addUtilisateur, utilisateur, utilisateurCours, changerAccesUtilisateur, getCoursById, getUtilisateurById, getUtilisateurByCourriel } from './model/methodeServeur.js';
import { validationAjoutCours } from './validationAjoutCours.js'
import { validationInscription } from './validationInscription.js';
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
app.use(middlewareSse());
app.use(express.static('public'));

// Programmation de routes

// Rendement de la page d'accueil
app.get('/', async (request, response) => {

        // Cree un tableau avec les utilisateur qui son dans les cours
        let listeCours = await getCoursServeur();

        for (let cours of listeCours) {
            let UtilisateurCours = await utilisateurCours(cours.id_cours);

            cours.utilisateur = UtilisateurCours
        }

    if (request.user) {
        response.render('accueil', {
            titre: 'BLAK.inc',
            h1: 'BLAK.inc',
            styles: ['/css/general.css'],
            scripts: ['/js/accueil.js'],
            user: request.user,
            aAcces: request.user.id_type_utilisateur > 1,
            accept: request.session.accept,
        });
    }
    else {
        response.redirect('/connexion')
    }

});

// Rendement de la page d'admin
app.get('/admin', async (request, response) => {
    if (request.user === undefined) {
        response.status(403).end();
    }
    else if (request.user.id_type_utilisateur > 1) {

        // Cree un tableau avec les utilisateur qui son dans les cours
        let listeCours = await getCoursServeur();

        for (let cours of listeCours) {
            let UtilisateurCours = await utilisateurCours(cours.id_cours);

            cours.utilisateur = UtilisateurCours
        }

        response.render('admin', {
            titre: 'BLAK.inc',
            h1: 'BLAK.inc',
            styles: ['/css/general.css'],
            scripts: ['/js/admin.js'],
            cours: listeCours,
            utilisateur: await utilisateur(),
            user: request.user,
            aAcces: request.user.id_type_utilisateur > 1,
            accept: request.session.accept,
        });
    }
    else response.status(403).end();
});

// Rendement de la page de cours
app.get('/cours', async (request, response) => {
    if (request.user === undefined) response.status(403).end();
    else {
        response.render('cours', {
            titre: 'BLAK.inc',
            h1: 'BLAK.inc',
            styles: ['/css/general.css'],
            scripts: ['/js/cours.js'],
            cours: await getCoursNonInscritServer(request.user.id_utilisateur),
            user: request.user,
            aAcces: request.user.id_type_utilisateur > 1,
            accept: request.session.accept,
            
        });
    }


});

// Rendement de la page de compte
app.get('/compte', async (request, response) => {
    if (request.user === undefined) response.status(403).end();
    else {
        response.render('compte', {
            titre: 'BLAK.inc',
            h1: 'BLAK.inc',
            styles: ['/css/general.css'],
            scripts: ['/js/compte.js'],
            compte: await getCoursInscritServer(request.user.id_utilisateur),
            user: request.user,
            aAcces: request.user.id_type_utilisateur > 1,
            accept: request.session.accept,
        });
    }
});

// Rendement de la page d'inscription
app.get('/inscription', (request, response) => {

    response.render('inscription', {
        titre: 'Inscription',
        scripts: ['/js/inscription.js'],
        styles: ['/css/general.css'],
        user: request.user,
        accept: request.session.accept,
    });
});

// Rendement de la page de connexion
app.get('/connexion', (request, response) => {
    response.render('connexion', {
        titre: 'Connexion',
        scripts: ['/js/connexion.js'],
        styles: ['/css/general.css'],
        user: request.user,
        accept: request.session.accept,
    });
});

// methode pour changer lacces dun user dans la DB
app.patch('/api/admin', async (request, response) => {
    if (request.user === undefined) response.status(403).end();

    else if (request.user.id_type_utilisateur > 1) {

        await changerAccesUtilisateur(request.body.id_utilisateur, request.body.id_type_utilisateur);

        response.status(201).end();
        response.pushJson(request.body, 'change-user-access');
    }
    else response.status(403).end();
});

// methode pour supprimer un cours de la DB
app.delete('/api/admin', async (request, response) => {
    if (request.user === undefined) response.status(403).end();

    else if (request.user.id_type_utilisateur > 1) {
        let id_cours = await deleteActivity(request.body.id_cours);
        response.status(200).json({ id_cours: id_cours });
        response.pushJson(id_cours, 'delete-cours');
    }
    else response.status(403).end();


});

// methode pour ajouter un cours dans la DB
app.post('/api/admin', async (request, response) => {
    if (!request.user) {
        response.status(401).end();
    }
    else if (request.user.id_type_utilisateur > 1 && validationAjoutCours(request.body)) {


        let id_cours = await addCours(request.body.nom, request.body.date_debut, request.body.nb_cours, request.body.capacite, request.body.description)
        
        let cours = await getCoursById(id_cours);
        
        response.status(201).json({ id_cours: id_cours });
        response.pushJson(cours, 'add-cours');
    }
    else response.status(403).end();
});

// methode pour sinscrire dans un cours
app.post('/api/cours', async (request, response) => {
    if (request.user === undefined) response.status(403).end();
    else {
        let id = await inscriptionActivity(request.body.id_cours, request.user.id_utilisateur);

        let cours = await getCoursById(request.body.id_cours);

        let utilisateur = await getUtilisateurById(request.user.id_utilisateur);

        response.status(200).json({ id: id });
        response.pushJson(cours, 'inscription-cours-update');
        response.pushJson(cours, 'inscription-cours');
        response.pushJson(utilisateur, 'inscription-cours-update-dropdown');
    }
});

// methode pour se desinscrire dun cours
app.delete('/api/compte', async (request, response) => {

    if (request.user === undefined) response.status(403).end();

    else {
        await desincrireActivity(request.body.id_cours, request.user.id_utilisateur);

        let cours = await getCoursById(request.body.id_cours);

        let utilisateur = await getUtilisateurById(request.user.id_utilisateur);

        response.status(200).end();
        response.pushJson(cours, 'desinscription-cours-update');
        response.pushJson(cours, 'desinscription-cours');
        response.pushJson(utilisateur, 'desinscription-cours-update-dropdown');
    }
});

// methode qui initialise le temps reel
app.get('/stream', (request, response) => {
    if (request.user) {
        response.initStream();
    }
    else {
        response.status(401).end();
    }
});

// methode qui gere lacceptation des cookies
app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});

// methode pour linscription dun nouvel utilisateur
app.post('/inscription', async (request, response, next) => {
    //valider les donner recu du client
    if (validationInscription(request.body)) {

        try {
            let id_utilisateur = await addUtilisateur(request.body.courriel, request.body.motDePasse, request.body.nom, request.body.prenom);


            let utilisateur = await getUtilisateurById(id_utilisateur);

            response.status(201).end();
            response.pushJson(utilisateur, 'update-new-user');
        }
        catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

// methode pour quun utilisateur puisse se connecter
app.post('/connexion', (request, response, next) => {
    //valider les donner recu du client
    if (true) {
        passport.authenticate('local', (error, courriel, info) => {
            if (error) {
                next(error);
            }
            else if (!courriel) {
                response.status(401).json(info);
                console.log(courriel);
                console.log(info);
            }
            else {
                request.logIn(courriel, (error) => {
                    if (error) {
                        next(error);
                    }
                    else {
                        response.status(200).end();
                    }
                });
            }
        })(request, response, next);
    }
    else {
        response.status(400).end();
    }
});

// methode pour quun utilisateur puisse se deconnecter
app.post('/deconnexion', (request, response, next) => {
    request.logOut((error) => {
        if (error) {
            next(error);
        }
        else {
            response.redirect('/');
        }
    })
});

// Démarrage du serveur
if (process.env.NODE_ENV === 'production') {
    app.listen(process.env.PORT);
    console.log('Serveur démarré: http://localhost:' + process.env.PORT);
}
else {
    const credentials = {
        key: await readFile('./security/localhost.key'),
        cert: await readFile('./security/localhost.cert')
    }

    https.createServer(credentials, app).listen(process.env.PORT)
    console.log('Serveur démarré: https://localhost:' + process.env.PORT);
}