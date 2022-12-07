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
    
    done(null, {
        id_utilisateur: utilisateur.id_utilisateur,
        courriel: utilisateur.courriel,
        id_type_utilisateur: utilisateur.id_type_utilisateur
    });
});

passport.deserializeUser(async (user, done) => {
     
    
    
    try {
        let utilisateur = await getUtilisateurByCourriel(user.courriel);
        done(null, utilisateur);
    }
    catch (error) {
        done(error);
        
    }
});

