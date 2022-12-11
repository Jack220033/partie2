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
let boutonTest = document.getElementById('bouton-test');
let userTable = document.getElementById('user-table');
let source = new EventSource('/stream');

//-----------------------Validation-------------------------------------------------------------------------------------//
// Nom
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

//Date
let inputDate = document.getElementById('date_debut');
let errorDate = document.getElementById('error-date_debut');

const validateDate = () => {
    return inputDate !== null;

}

form.addEventListener('submit', validateDate);

//nb_cours
let inputNbCours = document.getElementById('nb_cours');
let errorNbCours = document.getElementById('error-nb_cours');

const validateNbCours = () => {
    if (inputNbCours.validity.valid) {
        errorNbCours.style.display = 'none';
    }
    else if (inputNbCours.validity.rangeUnderflow) {
        errorNbCours.innerText = 'La valeur doit être supérieure à 5';
        errorNbCours.style.display = 'block';
    }
    else if (inputNbCours.validity.rangeOverflow) {
        errorNbCours.innerText = 'La valeur doit être inférieure ou égale à 30';
        errorNbCours.style.display = 'block';
    }
}
form.addEventListener('submit', validateNbCours);

//Capacite
let inputCapacite = document.getElementById('capacite');
let errorCapacite = document.getElementById('error-capacite');

const validateCapacite = () => {
    if (inputCapacite.validity.valid) {
        errorCapacite.style.display = 'none';
    }
    else if (inputCapacite.validity.rangeUnderflow) {
        errorCapacite.innerText = 'La valeur doit être supérieure à 10';
        errorCapacite.style.display = 'block';
    }
    else if (inputCapacite.validity.rangeOverflow) {
        errorCapacite.innerText = 'La valeur doit être inférieure ou égale à 50';
        errorCapacite.style.display = 'block';
    }
}
form.addEventListener('submit', validateCapacite);

//Description
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
        errorDescription.innerText = 'Le message doit avoir au moins 10 caractères';
        errorDescription.style.display = 'block';
    }
    else if (inputDescription.validity.tooLong) {
        errorDescription.innerText = 'Le message doit avoir au maximum 200 caractères';
        errorDescription.style.display = 'block';
    }
}
form.addEventListener('submit', validateDescription);


//----------------------------------------------- Fin Validation ---------------------------------------------------------//



const nbInscriptions = (event) => {
    event.preventDefault();
    let data = {
        id: event.currentTarget.dataset.id
    }

    fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

const addCoursClient = (cours) => {
    let trCours = document.createElement('tr');
    trCours.id = 'cours-row'+cours.id_cours;

    let thCours = document.createElement('th');
    thCours.scope = 'col';
    thCours.innerText = cours.nom;

    let div = document.createElement('div');
    div.classList.add('space-top');

    let details = document.createElement('details');

    let summary = document.createElement('summary');
    summary.classList.add('space-bottom');
    summary.innerText = 'Inscrits';

    let table = document.createElement('table');
    table.classList.add('table');

    let thead = document.createElement('thead');

    let trUserHead = document.createElement('tr');

    let thNom = document.createElement('th');
    thNom.scope = 'col';
    thNom.innerText = 'Nom';

    let thPrenom = document.createElement('th');
    thPrenom.scope = 'col';
    thPrenom.innerText = 'Prenom';

    let thCourriel = document.createElement('th');
    thCourriel.scope = 'col';
    thCourriel.innerText = 'Courriel';

    let tbody = document.createElement('tbody');

    let trUserBody = document.createElement('tr');

    let tdUserNom = document.createElement('td');
    //tdUserNom.innerText = utilisateur.nom;

    let tdUserPrenom = document.createElement('td');
    //tdUserPrenom.innerText = utilisateur.prenom;

    let tdUserCourriel = document.createElement('td');
    //tdUserCourriel.innerText = utilisateur.courriel;

    let tdCoursDates = document.createElement('td');
    tdCoursDates.innerText = cours.date_debut;

    let tdCoursNbCours = document.createElement('td');
    tdCoursNbCours.innerText = cours.nb_cours;

    let tdCoursCapacite = document.createElement('td');
    tdCoursCapacite.innerText = cours.capacite;

    let tdCoursDescription = document.createElement('td');
    tdCoursDescription.innerText = cours.description;

    let tdCoursCapaciteCourrante = document.createElement('td');
    tdCoursCapaciteCourrante.classList.add('capaciteC');
    tdCoursCapaciteCourrante.innerText = cours.nbInscription + ' / ' + cours.capacite;

    let thCoursBouton = document.createElement('th');

    let inputSupprimeCours = document.createElement('input');
    inputSupprimeCours.type = 'button';
    inputSupprimeCours.classList.add('btn');
    inputSupprimeCours.classList.add('btn-danger');
    inputSupprimeCours.classList.add('liste-boutons');
    inputSupprimeCours.name = 'delete';
    inputSupprimeCours.id = cours.id_cours;
    inputSupprimeCours.value = 'Supprimer';
    /*inputSupprimeCours.addEventListener('click', (event) => {
        deleteActivityClient(event.currentTarget.id);
    });*/
    thCoursBouton.append(inputSupprimeCours);

    trUserBody.append(tdUserNom);
    trUserBody.append(tdUserPrenom);
    trUserBody.append(tdUserCourriel);

    tbody.append(trUserBody);

    trUserHead.append(thNom);
    trUserHead.append(thPrenom);
    trUserHead.append(thCourriel);

    thead.append(trUserHead);

    table.append(thead);
    table.append(tbody);

    details.append(summary);
    details.append(table);

    div.append(details);

    thCours.append(div);

    trCours.append(thCours);
    trCours.append(tdCoursDates);
    trCours.append(tdCoursNbCours);
    trCours.append(tdCoursCapacite);
    trCours.append(tdCoursDescription);
    trCours.append(tdCoursCapaciteCourrante);
    trCours.append(thCoursBouton);

    tableCoursBody.append(trCours);
}

boutonTest.addEventListener('click', (event) => {
    addCoursClient(69, 'test nom', 69, 69, 69, 56, 'Ceci est un test', {
        nom: 'that',
        prenom: 'fuck', 
        courriel: 'fuck_this@fuckthis.com',
    });
});

const deleteActivityClient = (id_cours) => {
    let cours = document.getElementById('cours-row'+id_cours);
    console.log(id_cours);
    console.log(cours);
    cours.remove();

    
}
const updateInscriptionCoursClient = (cours) => {
    let tdCoursCapaciteCourante = document.getElementById('Capacite-courante-' + cours.id_cours);
    console.log(cours.id_cours);
    tdCoursCapaciteCourante.innerText = cours.nbInscription + ' / ' + cours.capacite;
}

const addUtilisateurClient = (utilisateur) => {
    trUser = document.createElement('tr');
    trUser.id = 'user-row-'+userTable.id_utilisateur;

    thUserNom = document.createElement('th');
    thUserNom.scope = 'row';
    thUserNom.innerText = utilisateur.nom;

    tdUserPrenom = document.createElement('td');
    tdUserPrenom.innerText = utilisateur.prenom;

    tdUserCourriel = document.createElement('td');
    tdUserCourriel.innerText = utilisateur.courriel;

    tdUserAcces = document.createElement('td');
    tdUserAcces.innerText = utilisateur.id_type_utilisateur;

    thChangerAcces = document.createElement('th');

    select = document.createElement('select');
    select.name = 'admin';
    select.classList.add('option-acces');
    select.id = utilisateur.id_utilisateur;

    optionSelected = document.createElement('option');
    optionSelected.innerText = 'Select';

    optionAdmin = document.createElement('option');
    optionAdmin.value = '2';
    optionAdmin.id = 'idAdmin';
    optionAdmin.innerText = 'Admin';

    optionRegulier = document.createElement('option');
    optionRegulier.value = '1';
    optionRegulier.id = 'idRegulier';
    optionRegulier.innerText = 'Regulier';

    bouton = document.createElement('input');
    bouton.type = 'button';
    bouton.classList.add('btn');
    bouton.classList.add('btn-danger');
    bouton.classList.add('bouton-acces');
    bouton.name = 'modify';
    bouton.id = utilisateur.id_utilisateur;
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

const deleteUserClient = (utilisateur) => {
    let userRow = document.getElementById('user-row-'+utilisateur.id_utilisateur);

    userRow.remove();
}




const deleteActivityServeur = async (event) => {
    event.preventDefault();

    let data = {
        id_cours: event.currentTarget.id
    }

    let response = await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    //location.reload();
}

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

    location.reload();
}

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
        description: inputDescription.value
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
    addCoursClient(data);

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
