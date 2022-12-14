let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-email');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let inputNom = document.getElementById('input-nom');
let inputPrenom = document.getElementById('input-prenom');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

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
        //Afficher erreur dans l'interface graphine
        console.log('utilisateur deja existant');

        
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
            else if (inputName.validity.valueMissing) {
                errorPrenom.innerText = 'Entrer votre prenom';
                errorPrenom.style.display = 'block';
            }
        }
        formAuth.addEventListener('submit', validName);

        //  validation du courriel
        let inputEmail = document.getElementById('input-email');
        let errorCourriel = document.getElementById('error-courriel');

        const validaEmail = () => {
            if (inputEmail.validity.valid) {
                errorCourriel.style.display = 'none';
            }
            else if (inputEmail.validity.valueMissing) {
                errorCourriel.innerText = 'Entrer votre courriel';
                errorCourriel.style.display = 'block';
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
            else if (inputPassword.validity.valueMissing) {
                errorPassword.innerText = 'Entrer votre mot de passe';
                errorPassword.style.display = 'block';
            }
        }
        formAuth.addEventListener('submit', validPassword);
        // -------fin de la validation de la inscrition-------