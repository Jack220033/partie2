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
        nom: inputNom.value,
        prenom: inputPrenom.value
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

        // Validation pour la page de connexion
        let inputCourriel = document.getElementById('input-email');
        let errorCourriel = document.getElementById('error-courriel');

        // Validation du courriel
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

        let inputPassword = document.getElementById('input-email');
        let errorPassword = document.getElementById('error-courriel');

        // Validation du mot de passe
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
        // -------fin de la validation de la connxion-------

    }
    else {
        console.log('Erreur inconnu');
    }
})
