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
    }
    else {
        console.log('Erreur inconnu');
    }
})
