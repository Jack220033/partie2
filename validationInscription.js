//validation du nom
const validateNom = (nom) => {
    return typeof nom === 'string' && !!nom;
}
const validatePrenom = (prenom) => {
    return typeof prenom === 'string' && !!prenom;
}
const validateEmail = (email) => {

    return typeof email === 'string' && 
        !!email && 
        email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

const validatePassword = (password) => {

    return typeof password === 'string' &&
        !!password &&
        password.match(/^(?=.*[A-Z])(?=.*\d.*\d)[^\s]{9,30}\$$/);
}
export const validationInscription = (body) => {
    
    return validateNom(body.nom) &&
        validatePrenom(body.prenom) &&
        validateEmail(body.courriel) &&
        validatePassword(body.motDePasse);
}