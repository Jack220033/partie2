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
        email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

// Validation du mot de passe
const validatePassword = (password) => {

    // if (password.validity.valid) {
    //     passwordErrorFiel.innerText = '';

    //     //Retire les classe de css si il a pas d'erreur
    //     passwordErrorFiel.classList.remove('active');
    //     password.classList.remove('active');
    // }
    // else {
    //     if (password.validity.valueMissing) {
    //         passwordErrorFiel.innerText = 'Veuillez entrer votre mot de passe.';
    //     }
    //     else if (password.validity.tooShort) {
    //         passwordErrorFiel.innerText = 'Votre mot de passe est trop court.';
    //     }
    //     //Ajouter les classe de CSS si il a des erreur
    //     passwordErrorFiel.classList.add('active');
    //     password.classList.add('active');
    // }

    return typeof password === 'string' &&
        !!password &&
        password.match(/^(?=.*[A-Z])(?=.*\d.*\d)[^\s]{9,30}\$$/);
}


// Exportation de la validation
export const validationInscription = (body) => {

    return validateNom(body.nom) &&
        validatePrenom(body.prenom) &&
        validateEmail(body.courriel) &&
        validatePassword(body.motDePasse);
}