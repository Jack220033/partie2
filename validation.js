//validation du nom
const validationNom = (nom) => {
    return typeof nom === 'string' && !!nom;
}

//Validation de la date
const validationDate = (date_debut) => {
    return date_debut !== null;
}

//Validation nombre de cours
const validationNbCours = (nb_cours) => {
    return typeof nb_cours === 'number' &&
        nb_cours >= 10 &&
        nb_cours <= 50;


}

//Validation capacite
const validationCapacite = (capacite) => {
    return typeof capacite === 'number' &&
        capacite >= 10 &&
        capacite <= 50;

}

//Validation description
const validationDescription = (description) => {
    return typeof description === 'string' &&
        !!description &&
        description.length >= 10 &&
        description.length <= 200;
}

//Validation Form
export const validationForm = (body) => {
    console.log(validationNom(body.nom), validationDate(body.date_debut), validationNbCours(body.nb_cours), validationCapacite(body.capacite), validationDescription(body.description))
    return validationNom(body.nom) &&
        validationDate(body.date_debut) &&
        validationNbCours(body.nb_cours) &&
        validationCapacite(body.capacite) &&
        validationDescription(body.description);
}