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
import { addCours, checkCours, deleteActivity, getCoursInscritServer, desincrireActivity, inscriptionActivity, getCoursNonInscritServer, getCoursServeur, addUtilisateur, utilisateur, utilisateurCours, changerAccesUtilisateur } from './model/methodeServeur.js';
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
app.get('/', async (request, response) => {
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

app.get('/admin', async (request, response) => {
    if (request.user === undefined) {
        response.status(403).end();
    }
    else if (request.user.id_type_utilisateur > 1) {

        // Cree un tableau avec les utilisateur qui son dans les cours
        let listeCours = await getCoursServeur();

        for(let cours of listeCours) {
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
/*    response.render('admin', {
        titre: 'BLAK.inc',
        h1: 'BLAK.inc',
        styles: ['/css/general.css'],
        scripts: ['/js/admin.js'],
        cours: await getCoursServeur(),
        utilisateur: await utilisateur(),
        user: request.user,
        aAcces: request.user.id_type_utilisateur = 2,
        accept: request.session.accept,
    });
});*/

app.get('/cours', async (request, response) => {
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
    console.log(utilisateur());
})

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

app.get('/inscription', (request, response) => {
    if (request.user === undefined) response.status(403).end();
    else {
        response.render('authentification', {
            titre: 'Inscription',
            scripts: ['/js/inscription.js'],
            styles: ['/css/general.css'],
            user: request.user,
            inscription: request.user,
            accept: request.session.accept,
        });
    }
});

app.get('/connexion', (request, response) => {
    response.render('authentification', {
        titre: 'Connexion',
        scripts: ['/js/connexion.js'],
        styles: ['/css/general.css'],
        user: request.user,
        accept: request.session.accept,
    });
});

app.post('/api/admin', async (request, response) => {
    if (request.user === undefined) response.status(403).end();

    else if (request.user.id_type_utilisateur > 1 && validationAjoutCours(request.body)) {
        let id = await addCours(request.body.nom, request.body.date_debut, request.body.nb_cours, request.body.capacite, request.body.description);
        response.status(201).json({ id: id });
    }
    else response.status(403).end();
});

/*app.post('/api/adminvalidation', async (request, response) => {
    if (validationAjoutCours(request.body)) {
        let id = await addCours(request.body.nom, request.body.date_debut, request.body.nb_cours, request.body.capacite, request.body.description);
        console.log(request.body);
        response.status(200).json({ id: id });
    }
    else {
        
        response.status(400).end();
    }
});*/

app.patch('/api/admin', async (request, response) => {
    if (request.user === undefined) response.status(403).end();

    else if (request.user.id_type_utilisateur > 1) {

        await changerAccesUtilisateur(request.body.id_utilisateur, request.body.id_type_utilisateur);

        response.status(201).end();
    }
    else response.status(403).end();
});

/*app.patch('/compte', async (request, response) => {
    await checkCours(request.body.id);
    response.status(200).end();

});*/

app.delete('/api/cours', async (request, response) => {
    if (request.user === undefined) response.status(403).end();

    else if (request.user.id_type_utilisateur > 1) {
        let changes = await deleteActivity(request.body.id_cours);
        response.status(200).json({ changes: changes });
    }
    else response.status(403).end();


});

app.post('/api/cours', async (request, response) => {
    if (!request.user) {
        response.status(401).end();
    }
    else if (request.user.acces <= 0) {
        response.status(403).end();
    }
    else {
        let id = await addCours(request.body.nom, request.body.description, request.body.capacite, request.body.date_debut, request.body.nb_cours)
        response.status(201).json({ id: id });
        response.pushJson({
            id: id,
            nom: request.body.nom,
            description: request.body.description,
            capacite: request.body.capacite,
            date_debut: request.body.date_debut,
            nb_cours: request.body.nb_cours
        }, 'add-cours')
    }

    // if (request.user === undefined) response.status(403).end();
    // else {
    //     let id = await inscriptionActivity(request.body.id_cours, request.user.id_utilisateur);
    //     response.status(200).json({ id: id });
    // }

});

app.delete('/api/compte', async (request, response) => {
    if (request.user === undefined) response.status(403).end();
    else {
        await desincrireActivity(request.body.id_cours, request.user.id_utilisateur);
        response.status(200).end();
    }


});

app.get('/stream', (request, response) => {
    if (request.user) {
        response.initStream();
    }
    else {
        response.status(401).end();
    }
});

app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});

app.post('/inscription', async (request, response, next) => {
    //valider les donner recu du client
    if (validationInscription(request.body)) {
        try {
            await addUtilisateur(request.body.courriel, request.body.motDePasse, request.body.nom, request.body.prenom);
            response.status(201).end();
        }
        catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                //console.log(request.body);
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