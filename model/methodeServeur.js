import connectionPromise from './connexion.js';
import {hash} from 'bcrypt';

export const getCoursDB = async () => {
    let connexion = await connectionPromise;

    let resultat = await connexion.all(`SELECT datetime(date_debut/1000, 'unixepoch', 'localtime') 
                                        AS  dates, nom, nb_cours, capacite, description, id_cours 
                                        FROM cours;`
    );
    return resultat;
}

export const getCoursServeur = async () => {
    let cours = await getCoursDB();
    for (let cour of cours) {
        let capaciteCourante = await nbInscriptions(cour.id_cours);

        cour.nbInscription = capaciteCourante;
        console.log(cour);

    }

    return cours;
}


export const getCoursNonInscritDB = async () => {
    let connexion = await connectionPromise;

    let resultat = await connexion.all(`SELECT datetime(date_debut/1000, 'unixepoch', 'localtime') 
                                        AS  dates, nom, nb_cours, capacite, description, id_cours 
                                        FROM cours
                                        WHERE id_cours NOT IN (
                                            SELECT id_cours
                                            FROM cours_utilisateur
                                            WHERE id_utilisateur = 1);`);

    return resultat;
}
export const getCoursNonInscritServer = async () => {
    let coursNonInscrit = await getCoursNonInscritDB();
    for (let cour of coursNonInscrit) {
        let capaciteCourante = await nbInscriptions(cour.id_cours);

        cour.nbInscription = capaciteCourante;
        console.log(cour);
    }

    return coursNonInscrit;
}


export const addCours = async (nom, date_debut, nb_cours, capacite, description) => {
    let connexion = await connectionPromise;

    JSON.parse(date_debut);

    let resultat = await connexion.run(
        `INSERT INTO cours (nom, date_debut, nb_cours, capacite, description)
        VALUES (?,?,?,?,?)`,
        [nom, date_debut, nb_cours, capacite, description]
    );
    console.log(nom);
    return resultat.lastID;
}

export const deleteActivity = async (id_cours) => {

    let connexion = await connectionPromise;

    await connexion.run(
        `DELETE FROM cours WHERE id_cours = ?`,
        [id_cours]
    );
}


export const desincrireActivity = async (id_cours, id_utilisateur) => {
    let connexion = await connectionPromise;

    let result = await connexion.run(
        `DELETE FROM cours_utilisateur WHERE id_cours = ? AND id_utilisateur = ?`,
        [id_cours, id_utilisateur]
    )

    return result.changes;
}

export const inscriptionActivity = async (id_cours, id_utilisateur) => {

    let connexion = await connectionPromise;

    let result = await connexion.run(
        `INSERT INTO cours_utilisateur (id_cours, id_utilisateur)
        VALUES (?, ?)`,
        [id_cours, id_utilisateur]
    )

    return result.lastID;
}

export const checkCours = async (id) => {
    let connexion = await connectionPromise;

    let resultat = await connexion.run(
        `UPDATE utilisateur
        SET est_coche = NOT est_coche
        WHERE id_utilisateur = ?`,
        [id]
    )

    return resultat.changes;
}

export const getCoursInscritDB = async (id_utilisateur) => {
    let connexion = await connectionPromise;

    let resultat = await connexion.all(
        `SELECT datetime(date_debut/1000, 'unixepoch', 'localtime') 
        AS  dates, nom, nb_cours, capacite, description, id_cours 
        FROM cours
        WHERE id_cours IN (
            SELECT id_cours
            FROM cours_utilisateur
            WHERE id_utilisateur = ?);`
            [id_utilisateur]
    );

    return resultat;

}
export const getCoursInscritServer = async (id_utilisateur) => {
    let coursInscrit = await getCoursInscritDB(id_utilisateur);
    for (let cour of coursInscrit) {
        let capaciteCourante = await nbInscriptions(cour.id_cours);

        cour.nbInscription = capaciteCourante;
        //console.log(cour);
    }
    return coursInscrit;
}


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



export const addUtilisateur = async (Courriel, motDePasse) => {
    let connexion = await connectionPromise;

    let motDePassHash = await hash(motDePasse, 10);

    await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom)
        VALUES (1, ?, ?, "test1", 'test2')`,
        [Courriel, motDePassHash]
    ); 
}

export const getUtilisateurByCourriel = async (Courriel) => {
    let connexion = await connectionPromise;

     let courriel = await connexion.get(
        `SELECT id_utilisateur, courriel, mot_passe
        FROM utilisateur
        WHERE courriel = ?`,
        [Courriel]
    )

    return courriel;
}