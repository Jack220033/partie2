let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-email');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let inputNom = document.getElementById('input-nom');
let inputPrenom = document.getElementById('input-prenom');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log(inputPrenom.value);

    let data = {
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value,
        nom: inputNom.value,
        prenom: inputPrenom.value,
    }

    let response = await fetch('/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.replace('/connexion');
    }
    else if (response.status === 409) {
        //Afficher erreur dans l'interface graphique
        console.log('Utilisateur deja existant');

        // Si l'utilisateur se connect avec un compte qui n'exsite pas
        errorCourriel.innerText = "Il a deja un utilisateur avec cette adress courriel";
        errorCourriel.style.display = 'block';
    }
    else {
        console.log('Erreur inconnu');
    }
})

// Validation pour la page de inscrition
// Validation du nom
let inputLastName = document.getElementById('input-nom');
let errorNom = document.getElementById('error-nom');

const validLastName = () => {
    if (inputLastName.validity.valid) {
        errorNom.style.display = 'none';
    }
    // Validation du champ de nom si il est vide
    else if (inputLastName.validity.valueMissing) {
        errorNom.innerText = 'Entrer votre nom';
        errorNom.style.display = 'block'
    }
}
formAuth.addEventListener('submit', validLastName);

// Validation du prenom
let inputName = document.getElementById('input-prenom');
let errorPrenom = document.getElementById('error-prenom');

const validName = () => {
    if (inputName.validity.valid) {
        errorPrenom.style.display = 'none';
    }
    // Validation si le champ du prenom est vide
    else if (inputName.validity.valueMissing) {
        errorPrenom.innerText = 'Entrer votre prenom';
        errorPrenom.style.display = 'block';
    }
}
formAuth.addEventListener('submit', validName);

//  validation du courriel
let inputEmail = document.getElementById('input-email');
let errorCourriel = document.getElementById('error-courriel');
let example = "example@gmial.com"


const validaEmail = () => {
    if (inputEmail.validity.valid) {
        errorCourriel.style.display = 'none';
    }
    // Validation si le champ de courriel ne respect pas le parttern
    else if (inputEmail.validity.typeMismatch) {
        errorCourriel.innerText = 'Entrer un courriel valide ex: "test@test.com"';
        errorCourriel.style.display = 'block';
    }
    //  Validation si le champ du courriel est vide
    else if (inputEmail.validity.valueMissing) {
        errorCourriel.innerText = 'Entrer votre courriel';
        errorCourriel.style.display = 'block';
    }
    else if (/@gm(ia|a|i)l.com$/.test(example)) {
        errorCourriel.innerText = "Votre courriel n'est pas valide. Fait sur de mettre .ca ou .com, etc"
        errorCourriel.style.display = 'block'
    }
}
formAuth.addEventListener('submit', validaEmail);

//  validation du mot de passe 
let inputPassword = document.getElementById('input-mot-de-passe');
let errorPassword = document.getElementById('error-password');

const validPassword = () => {
    if (inputPassword.validity.valid) {
        errorPassword.style.display = 'none';
    }
    // Validation si le mot de passe est trop long
    else if (inputPassword.validity.tooShort) {
        errorPassword.innerText = 'Le mot de passe est trop cour';
        errorPassword.style.display = 'block';
    }
    // Validation si le mot de passe est trop cours
    else if (inputPassword.validity.tooLong) {
        errorPassword.innerText = 'Le mot de passe est trop long';
        errorPassword.style.display = 'block';
    }
    // Validation si le champ du mot de passe est vide
    else if (inputPassword.validity.valueMissing) {
        errorPassword.innerText = 'Entrer votre mot de passe';
        errorPassword.style.display = 'block';
    }
    // si le mot de passe ne match pas le pattern
    else if (inputPassword.validity.patternMismatch) {
        errorPassword.innerText = "Le mot de passe n'est pas valide. Fait sur qui a une majucule et un caratere special";
        errorPassword.style.display = 'block';
    }
}
formAuth.addEventListener('submit', validPassword);
        // -------fin de la validation de la inscrition-------