let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-email');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let inputNom = document.getElementById('input-nom');
let inputPrenom = document.getElementById('input-presnom');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value,
        nom: inputNom.value,
        prenom: inputPrenom.value
    }

    let response = await fetch('/inscription', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/connexion');
    }
    else if(response.status === 409) {
        //Afficher erreur dans l'interface graphine
        console.log('utilisateur deja existant');
    }
    else {
        console.log('Erreur inconnu');
    }
})