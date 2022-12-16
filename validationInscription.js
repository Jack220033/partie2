//validation du nom
const validateNom = (nom) => {
    return typeof nom === 'string' && !!nom;
}

// Validation du prenom
const validatePrenom = (prenom) => {
    return typeof prenom === 'string' && !!prenom;
}

// Validation du courriel
const validateEmail = (email) => {

    return typeof email === 'string' &&
        !!email &&
        email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/);
}

// Validation du mot de passe
const validatePassword = (password) => {
    return typeof password === 'string' &&
        !!password &&
        password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
}


// Exportation de la validation
export const validationInscription = (body) => {
    
    return validateNom(body.nom) &&
        validatePrenom(body.prenom) &&
        validateEmail(body.courriel) &&
        validatePassword(body.motDePasse);
}