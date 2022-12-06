import { compare } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { getUtilisateurByCourriel } from "./model/methodeServeur.js";

let config = {
    usernameField: 'courriel',
    passwordField: 'mot_passe',
}

passport.use(new Strategy(config, async (courriel, mot_passe, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(courriel);

        if (!utilisateur) {
            return done(null, false, { erreur: 'erreur_nom_utilisateur' });
        }

        let valide = await compare(mot_passe, utilisateur.mot_passe);

        if (!valide) {
            return done(null, false, { erreur: 'erreur_mot_passe' });
        }
        return done(null, utilisateur);
    }

    catch (error) {
        return done(error);
    }

}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.courriel);
});

passport.deserializeUser(async (courriel, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(courriel);
        done(null, utilisateur);
    }
    catch (error) {
        done(error);
    }
});

