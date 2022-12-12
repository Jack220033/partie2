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

        // Validation du nom
        let inputNom = document.getElementById('');
        let errorNom = document.getElementById('');

        const validNom = () => {
            if(inputCourriel.validity.valid){
                errorNom.style.display = 'none';
            }
            else if (inputNom.validity.valueMissing){
                errorNom.innerText = 'Entrer votre nom';
                errorNom.style.display = 'block'
            }
        }
        form.addEventListener('submit', validNom);

        // Validation du prenom
        let inputPrenom = document.getElementById('');
        let errorPrenom = document.getElementById('');

        const validPrenom = () => {
            if(inputPrenom.validity.valid){
                errorPrenom.style.display = 'none';
            }
            else if(inputPrenom.validity.valueMissing){
                errorPrenom.innerText = 'Entrer votre prenom';
                errorPrenom.style.display = 'block';
            }
        }
        form.addEventListener('submit', validPrenom);

        // Validation pour la page de inscrition
        let inputCourriel = document.getElementById('input-email');
        let errorCourriel = document.getElementById('error-courriel');

        //  validation du courriel
        const validaCourriel = () => {
            if (inputCourriel.validity.valid) {
                errorCourriel.style.display = 'none';
            }
            else if (inputCourriel.validity.valueMissing) {
                errorCourriel.innerText = 'Entrer votre courriel valide';
                errorCourriel.style.display = 'none';
            }
        }
        form.addEventListener('submit', validaCourriel);

        //  validation du mot de passe 
        let inputPassword = document.getElementById('input-email');
        let errorPassword = document.getElementById('error-courriel');

        const validPassword = () => {
            if (inputCourriel.validity.valid) {
                errorPassword.style.display = 'none';
            }
            else if (inputPassword.validity.valueMissing) {
                errorPassword.innerText = 'Entrer votre mot de passe';
                errorPassword.style.display = 'block';
            }
        }
        form.addEventListener('submit', validPassword);
        // -------fin de la validation de la inscrition-------
    }
    else {
        console.log('Erreur inconnu');
    }
})