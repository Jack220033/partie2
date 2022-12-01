import connectionPromise from './connexion.js';
import {hash} from 'bcrypt';

export const addUtilisateur = async (courriel, motDePasse) => {
    let connexion = await connectionPromise;

    let motDePassHash = await hash(motDePasse, 10);

    await connexion.run(
        `INSERT INTO utilisateur (nom_utilisateur, mot_de_passe, acces)
        VALUES (?, ?, 0)`,
        [courriel, motDePassHash]
    ); 
}

export const getUtilisateurByNom = async (courriel) => {
    let connexion = await connectionPromise;

    let courriel = await connexion.get(
        `SELECT id_utilisateur, nom_utilisateur, mot_de_passe, acces
        FROM utilisateur
        WHERE nom_utilisateur = ?`,
        [courriel]
    )

    return courriel;
}