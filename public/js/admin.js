import { addCoursClient, updateInscriptionCoursClient, deleteActivityClient } from "./methode-commune.js";

let ul = document.getElementById('liste-cours');
let deleteBtn = document.getElementById('delete');
let form = document.getElementById('form-cours');
let checkboxes = document.querySelectorAll('#liste-cours input');
let buttons = document.querySelectorAll('.liste-boutons');
let capaciteC = document.querySelectorAll('.capaciteC');
let options = document.querySelectorAll('.option-acces');
let boutonAcces = document.querySelectorAll('.bouton-acces');
let formAcces = document.querySelectorAll('.form-acces');
let tableCoursBody = document.getElementById('cours-table');
let userCoursTable = document.getElementById('user-cours-table');
let userTable = document.getElementById('user-table');
let source = new EventSource('/stream');

//-----------------------Validation-------------------------------------------------------------------------------------//
// Validation Nom
let inputNom = document.getElementById('nom');
let errorNom = document.getElementById('error-nom');
const validateNom = () => {
    if (inputNom.validity.valid) {
        errorNom.style.display = 'none';
    }
    else if (inputNom.validity.valueMissing) {
        errorNom.innerText = 'Ce champ est requis';
        errorNom.style.display = 'block';
    }
}
form.addEventListener('submit', validateNom);

// Validation Date
let inputDate = document.getElementById('date_debut');
let errorDate = document.getElementById('error-date_debut');

const validateDate = () => {
    
    if(inputDate.validity.valid){
        errorDate.style.display = 'none';
    }
    else if (inputDate.validity.valueMissing){
        errorDate.innerText = 'Ce champ est requis';
        errorDate.style.display = 'block'; 
    }
}
form.addEventListener('submit', validateDate);

// Validation nb_cours
let inputNbCours = document.getElementById('nb_cours');
let errorNbCours = document.getElementById('error-nb_cours');

const validateNbCours = () => {
    if (inputNbCours.validity.valid) {
        errorNbCours.style.display = 'none';
    }
    else if( inputNbCours.validity.valueMissing) {
        errorNbCours.innerText = 'Ce champ est requis';
        errorNbCours.style.display = 'block'
    }
    else if (inputNbCours.validity.rangeUnderflow) {
        errorNbCours.innerText = 'La valeur doit ??tre sup??rieure ?? 5';
        errorNbCours.style.display = 'block';
    }
    else if (inputNbCours.validity.rangeOverflow) {
        errorNbCours.innerText = 'La valeur doit ??tre inf??rieure ou ??gale ?? 30';
        errorNbCours.style.display = 'block';
    }
}
form.addEventListener('submit', validateNbCours);

// Validation Capacite
let inputCapacite = document.getElementById('capacite');
let errorCapacite = document.getElementById('error-capacite');

const validateCapacite = () => {
    if (inputCapacite.validity.valid) {
        errorCapacite.style.display = 'none';
    }
    else if (inputCapacite.validity.valueMissing){
        errorCapacite.innerText = 'Ce champ est requis';
        errorCapacite.style.display = 'block'
    }
    else if (inputCapacite.validity.rangeUnderflow) {
        errorCapacite.innerText = 'La valeur doit ??tre sup??rieure ?? 10';
        errorCapacite.style.display = 'block';
    }
    else if (inputCapacite.validity.rangeOverflow) {
        errorCapacite.innerText = 'La valeur doit ??tre inf??rieure ou ??gale ?? 50';
        errorCapacite.style.display = 'block';
    }
}
form.addEventListener('submit', validateCapacite);

// Validation Description
let inputDescription = document.getElementById('description');
let errorDescription = document.getElementById('error-description');

const validateDescription = () => {
    if (inputDescription.validity.valid) {
        errorDescription.style.display = 'none';
    }
    else if (inputDescription.validity.valueMissing) {
        errorDescription.innerText = 'Ce champ est requis';
        errorDescription.style.display = 'block';
    }
    else if (inputDescription.validity.tooShort) {
        errorDescription.innerText = 'Le message doit avoir au moins 10 caract??res';
        errorDescription.style.display = 'block';
    }
    else if (inputDescription.validity.tooLong) {
        errorDescription.innerText = 'Le message doit avoir au maximum 200 caract??res';
        errorDescription.style.display = 'block';
    }
}
form.addEventListener('submit', validateDescription);

//----------------------------------------------- Fin Validation ---------------------------------------------------------//

// On change la permission des utilisateur pour admin ou regulier
const addUtilisateurClient = (utilisateur) => {
    let trUser = document.createElement('tr');
    trUser.id = 'user-row-' + utilisateur.id_utilisateur;

    let thUserNom = document.createElement('th');
    thUserNom.scope = 'row';
    thUserNom.innerText = utilisateur.nom;

    let tdUserPrenom = document.createElement('td');
    tdUserPrenom.innerText = utilisateur.prenom;

    let tdUserCourriel = document.createElement('td');
    tdUserCourriel.innerText = utilisateur.courriel;

    let tdUserAcces = document.createElement('td');
    tdUserAcces.innerText = utilisateur.id_type_utilisateur;

    let thChangerAcces = document.createElement('th');

    let select = document.createElement('select');
    select.name = 'admin';
    select.classList.add('option-acces');
    select.id = utilisateur.id_utilisateur;

    let optionSelected = document.createElement('option');
    optionSelected.innerText = 'Select';

    let optionAdmin = document.createElement('option');
    optionAdmin.value = '2';
    optionAdmin.id = 'idAdmin';
    optionAdmin.innerText = 'Admin';

    let optionRegulier = document.createElement('option');
    optionRegulier.value = '1';
    optionRegulier.id = 'idRegulier';
    optionRegulier.innerText = 'Regulier';

    let bouton = document.createElement('input');
    bouton.type = 'button';
    bouton.classList.add('btn');
    bouton.classList.add('btn-danger');
    bouton.classList.add('bouton-acces');
    bouton.name = 'modify';
    bouton.id = 'user-access-' + utilisateur.id_utilisateur;
    bouton.value = 'Modifier';
    bouton.style = 'background-color: black; border-color: black;';

    select.append(optionSelected);
    select.append(optionAdmin);
    select.append(optionRegulier);

    thChangerAcces.append(select);
    thChangerAcces.append(bouton);

    trUser.append(thUserNom);
    trUser.append(tdUserPrenom);
    trUser.append(tdUserCourriel);
    trUser.append(tdUserAcces);
    trUser.append(thChangerAcces);

    userTable.append(trUser);
}

// Changer l'acces des utilisateur du cote client
const changeUserAccessClient = (utilisateur) => {

    let userAccess =document.getElementById('user-access-'+utilisateur.id_utilisateur);
    userAccess.innerText = utilisateur.id_type_utilisateur;
}

// Supprimer un cour sur le cote serveur
const deleteActivityServeur = async (event) => {
    event.preventDefault();

    let data = {
        id_cours: parseInt(event.currentTarget.id),
    }

    let response = await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Changer l'acces de l'utilisateur du cote serveur
const changeUserAccessServeur = async (event) => {
    event.preventDefault();

    let target = parseInt(event.currentTarget.id);
    let selection = parseInt(options.item(target-1).value);

    let data = {
        id_utilisateur: parseInt(event.currentTarget.id),
        id_type_utilisateur: selection,
    }

    await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Ajout de cour sur le cote du serveur
const addCoursServeur = async (event) => {
    event.preventDefault();

    //On met la date en epoch dans la base de donner
    const myDate = inputDate.value;
    const myEpoch = new Date(myDate).getTime();

    if (!form.checkValidity()) {
        return;
    }

    let data = {
        nom: inputNom.value,
        date_debut: myEpoch,
        nb_cours: parseInt(inputNbCours.value),
        capacite: parseInt(inputCapacite.value),
        description: inputDescription.value,
        nbInscriptions: 0
    }
    
    let response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {        
        inputNom.value = '';
        inputDate.value = '';
        inputNbCours.value = '';
        inputCapacite.value = '';
        inputDescription.value = '';
    }
}

// Ajout d'un utilisateur sur le cote client
const addUserCoursClient = (utilisateur) => {

    let tr = document.createElement('tr');
    tr.id = 'user-cours-row-' + utilisateur.id_utilisateur;

    let tdNom = document.createElement('td');
    tdNom.innerText = utilisateur.nom;

    let tdPrenom = document.createElement('td');
    tdPrenom.innerText = utilisateur.prenom;

    let tdCourriel = document.createElement('td');
    tdCourriel.innerText = utilisateur.courriel;

    tr.append(tdNom);
    tr.append(tdPrenom);
    tr.append(tdCourriel);

    userCoursTable.append(tr);
}

// Supprimer un cours sur le cote client
const deleteUserCoursClient = (utilisateur) => {
    let user = document.getElementById('user-cours-row-' + utilisateur.id_utilisateur);
    
    user.remove();
}

// Soumission ajout d'un cours
form.addEventListener('submit', addCoursServeur);

for (let btn of buttons) {
    btn.addEventListener('click', deleteActivityServeur);
}

for (let btn of boutonAcces) {
    btn.addEventListener('click', changeUserAccessServeur);
}
//-------------------------------- Realtime Events ---------------------------------------------

source.addEventListener('add-cours', (event) => {
    let data = JSON.parse(event.data);    
    addCoursClient(data, tableCoursBody);

    let btn = document.getElementById(data.id_cours);
    btn.addEventListener('click', deleteActivityServeur);
});

source.addEventListener('delete-cours', (event) => {
    let data = JSON.parse(event.data);
    deleteActivityClient(data);
});

source.addEventListener('inscription-cours-update', (event) => {
    let data = JSON.parse(event.data);
    updateInscriptionCoursClient(data);
});

source.addEventListener('desinscription-cours-update', (event) => {
    let data = JSON.parse(event.data);
    updateInscriptionCoursClient(data);
});

source.addEventListener('inscription-cours-update-dropdown', (event) => {
    let data = JSON.parse(event.data);
    addUserCoursClient(data);
});

source.addEventListener('desinscription-cours-update-dropdown', (event) => {
    let data = JSON.parse(event.data);
    deleteUserCoursClient(data);
});

source.addEventListener('update-new-user', (event) => {
    let data = JSON.parse(event.data);
    addUtilisateurClient(data);

    let btn = document.getElementById('user-access-' + data.id_utilisateur);
    btn.addEventListener('click', changeUserAccessClient);
});

source.addEventListener('change-user-access', (event) => {
    let data = JSON.parse(event.data);
    changeUserAccessClient(data);
});