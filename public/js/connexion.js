let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-email');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let inputNom = document.getElementById('input-nom');
let inputPrenom = document.getElementById('input-prenom');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        courriel: inputCourriel.value,
        mot_passe: inputMotDePasse.value,
    }

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.replace('/');
    }
    else if (response.status === 401) {
        let info = await response.json();

        //Afficher erreur dans l'interface graphine
        console.log(info);

        // Si l'utilisateur se connect avec un compte qui n'exsite pas
        errorCourriel.innerText = "Soit le courriel ou le mot de passe a une erreur. Ou ce compte n'exsite pas";
        errorCourriel.style.display = 'block';
    }
    else {
        console.log('Erreur inconnu');
    }
})

// Validation pour la page de connexion
// Validation du courriel
let inputEmail = document.getElementById('input-email');
let errorCourriel = document.getElementById('error-courriel');

const validaEmail = () => {
    if (inputEmail.validity.valid) {
        errorCourriel.style.display = 'none';
    }
    else if (inputEmail.validity.typeMismatch) {
        errorCourriel.innerText = 'Entrer un courriel valide ex: "test@test.com"';
        errorCourriel.style.display = 'block';
    }
    else if (inputEmail.validity.valueMissing) {
        errorCourriel.innerText = 'Entrer votre courriel';
        errorCourriel.style.display = 'block';
    }
}
formAuth.addEventListener('submit', validaEmail);

// Validation du mot de passe
let inputPassword = document.getElementById('input-mot-de-passe');
let errorPassword = document.getElementById('error-password');

const validPassword = () => {
    if (inputPassword.validity.valid) {
        errorPassword.style.display = 'none';
    }
    else if (inputPassword.validity.valueMissing) {
        errorPassword.innerText = 'Entrer votre mot de passe';
        errorPassword.style.display = 'block';
    }
}
formAuth.addEventListener('submit', validPassword);
        // -------fin de la validation de la connxion-------
