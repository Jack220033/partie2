import connectionPromise from './connexion.js';
import { hash } from 'bcrypt';

// retourne les cours de la base des donnees
export const getCoursDB = async () => {
    let connexion = await connectionPromise;

    let resultat = await connexion.all(`SELECT datetime(date_debut/1000, 'unixepoch', 'localtime') 
                                            AS  dates, nom, nb_cours, capacite, description, id_cours 
                                            FROM cours;`
    );
    return resultat;
}

// ajoute les nombre dinscription dans les propriete les cours
export const getCoursServeur = async () => {
    let cours = await getCoursDB();
    for (let cour of cours) {
        let capaciteCourante = await nbInscriptions(cour.id_cours);

        cour.nbInscription = capaciteCourante;


    }

    return cours;
}

// retourne les cours non inscrit de la base des donnees pour un utilisateur
export const getCoursNonInscritDB = async (id_utilisateur) => {
    let connexion = await connectionPromise;

    let resultat = await connexion.all(`SELECT datetime(date_debut/1000, 'unixepoch', 'localtime') 
                                        AS  dates, nom, nb_cours, capacite, description, id_cours 
                                        FROM cours
                                        WHERE id_cours NOT IN (
                                            SELECT id_cours
                                            FROM cours_utilisateur
                                            WHERE id_utilisateur = ?);`,
        [id_utilisateur]
    );


    return resultat;
}

// ajoute les nombre dinscription dans les propriete du cours
export const getCoursNonInscritServer = async (id_utilisateur) => {
    let coursNonInscrit = await getCoursNonInscritDB(id_utilisateur);
    for (let cour of coursNonInscrit) {
        let capaciteCourante = await nbInscriptions(cour.id_cours);

        cour.nbInscription = capaciteCourante;

    }


    return coursNonInscrit;
}

// ajoute un cours dans la DB
export const addCours = async (nom, date_debut, nb_cours, capacite, description) => {
    let connexion = await connectionPromise;

    JSON.parse(date_debut);

    let resultat = await connexion.run(
        `INSERT INTO cours (nom, date_debut, nb_cours, capacite, description)
        VALUES (?,?,?,?,?)`,
        [nom, date_debut, nb_cours, capacite, description]
    );

    return resultat.lastID;
}

// supprime un cours de la DB
export const deleteActivity = async (id_cours) => {

    let connexion = await connectionPromise;

    await connexion.run(
        `DELETE FROM cours WHERE id_cours = ?`,
        [id_cours]
    );

    return id_cours;
}

// desinscrit un utilisateur de la DB
export const desincrireActivity = async (id_cours, id_utilisateur) => {
    let connexion = await connectionPromise;

    let result = await connexion.run(
        `DELETE FROM cours_utilisateur WHERE id_cours = ? AND id_utilisateur = ?`,
        [id_cours, id_utilisateur]
    )

    return result.changes;
}

// inscrit un utilisateur dans la DB
export const inscriptionActivity = async (id_cours, id_utilisateur) => {

    let connexion = await connectionPromise;

    let result = await connexion.run(
        `INSERT INTO cours_utilisateur (id_cours, id_utilisateur)
        VALUES (?, ?)`,
        [id_cours, id_utilisateur]
    )

    return result.lastID;
}

// retourne les cours inscrit de la base des donnees pour un utilisateur
export const getCoursInscritDB = async (id_utilisateur) => {
    let connexion = await connectionPromise;

    let resultat = await connexion.all(
        `SELECT datetime(date_debut/1000, 'unixepoch', 'localtime') 
        AS  dates, nom, nb_cours, capacite, description, id_cours 
        FROM cours
        WHERE id_cours IN (
            SELECT id_cours
            FROM cours_utilisateur
            WHERE id_utilisateur = ?);`,
        [id_utilisateur]
    );

    return resultat;

}

// ajoute le nombre dinscription dans les propriete du cours
export const getCoursInscritServer = async (id_utilisateur) => {
    let coursInscrit = await getCoursInscritDB(id_utilisateur);
    for (let cour of coursInscrit) {
        let capaciteCourante = await nbInscriptions(cour.id_cours);

        cour.nbInscription = capaciteCourante;
    }
    return coursInscrit;
}

// retourne le nombre dinscription dun cours de la DB
export const nbInscriptions = async (id_cours) => {
    let connexion = await connectionPromise;

    let resultat = await connexion.all(
        `SELECT *
        FROM cours_utilisateur 
        WHERE id_cours = ?`,
        [id_cours]
    );

    return resultat.length;
}


// ajoute un utilisateur dans la DB
export const addUtilisateur = async (Courriel, motDePasse, prenom, nom) => {
    let connexion = await connectionPromise;

    let motDePassHash = await hash(motDePasse, 10);

    let resultat = await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom)
        VALUES (1, ?, ?, ?, ?)`,
        [Courriel, motDePassHash, prenom, nom]
    );
    return resultat.lastID;
}

// trouve un utilisateur avec son courriel
export const getUtilisateurByCourriel = async (Courriel) => {
    let connexion = await connectionPromise;

    let courriel = await connexion.get(
        `SELECT id_utilisateur, courriel, mot_passe, id_type_utilisateur
        FROM utilisateur
        WHERE courriel = ?`,
        [Courriel]
    )

    return courriel;
}

// trouve un utilisateur avec son id
export const getUtilisateurById = async (id_utilisateur) => {
    let connexion = await connectionPromise;

    let utilisateur = await connexion.get(
        `SELECT id_utilisateur, nom, prenom, courriel, id_type_utilisateur
        FROM utilisateur
        WHERE id_utilisateur = ?`,
        [id_utilisateur]
    )

    return utilisateur;
}

// change lacces dun utilisateur dans la DB
export const changerAccesUtilisateur = async (id_utilisateur, id_type_utilisateur) => {
    let connexion = await connectionPromise;

    await connexion.run(
        `UPDATE utilisateur
        SET id_type_utilisateur = ?
        WHERE id_utilisateur = ?`,
        [id_type_utilisateur, id_utilisateur]
    );

}

// retourne tous les utilisateur de la DB
export const utilisateur = async () => {
    let connexion = await connectionPromise;

    let utilisateur = await connexion.all(
        `SELECT nom, prenom, courriel, id_type_utilisateur, id_utilisateur
        FROM utilisateur`

    )
    return utilisateur
}

// retourne la liste des utilisateurs inscrit dans un cours
export const utilisateurCours = async (id_cours) => {
    let connexion = await connectionPromise;

    let coursUtilisateur = await connexion.all(
        `SELECT nom, prenom, courriel, id_utilisateur
        FROM utilisateur
        WHERE id_utilisateur IN (
        SELECT id_utilisateur
        FROM cours_utilisateur 
        WHERE id_cours = ?);`,
        [id_cours]
    )
    return coursUtilisateur

}

// trouve un cours dans la DB avec son id
export const getCoursById = async (id_cours) => {
    let connexion = await connectionPromise;

    let cours = await connexion.get(
        `SELECT datetime(date_debut/1000, 'unixepoch', 'localtime') 
        AS  dates, nom, nb_cours, capacite, description, id_cours 
        FROM cours
        WHERE id_cours = ?;`,
        [id_cours]
    );
    

    let capaciteCourante = await nbInscriptions(cours.id_cours);

    cours.nbInscription = capaciteCourante;

    return cours;

}
