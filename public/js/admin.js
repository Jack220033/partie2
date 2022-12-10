let ul = document.getElementById('liste-cours');
let nom = document.getElementById('nom');
let date_debut = document.getElementById('date_debut');
let nb_cours = document.getElementById('nb_cours');
let capacite = document.getElementById('capacite');
let description = document.getElementById('description');
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

const addCoursClient = (id_cours, nom, date_debut, nb_cours, capacite, nbInscription, description, utilisateur) => {
    let trCours = document.createElement('tr');
    trCours.id = id_cours;

    let thCours = document.createElement('th');
    thCours.scope = 'col';
    thCours.innerText = nom;

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
    tdUserNom.innerText = utilisateur.nom;

    let tdUserPrenom = document.createElement('td');
    tdUserPrenom.innerText = utilisateur.prenom;

    let tdUserCourriel = document.createElement('td');
    tdUserCourriel.innerText = utilisateur.courriel;

    let tdCoursDates = document.createElement('td');
    tdCoursDates.innerText = date_debut;

    let tdCoursNbCours = document.createElement('td');
    tdCoursNbCours.innerText = nb_cours;

    let tdCoursCapacite = document.createElement('td');
    tdCoursCapacite.innerText = capacite;

    let tdCoursDescription = document.createElement('td');
    tdCoursDescription.innerText = description;

    let tdCoursCapaciteCourrante = document.createElement('td');
    tdCoursCapaciteCourrante.classList.add('capaciteC');
    tdCoursCapaciteCourrante.innerText = nbInscription + ' / ' + capacite;

    let thCoursBouton = document.createElement('th');

    let inputSupprimeCours = document.createElement('input');
    inputSupprimeCours.type = 'button';
    inputSupprimeCours.classList.add('btn');
    inputSupprimeCours.classList.add('btn-danger');
    inputSupprimeCours.classList.add('liste-boutons');
    inputSupprimeCours.name = 'delete';
    inputSupprimeCours.id = id_cours;
    inputSupprimeCours.value = 'Supprimer';
    inputSupprimeCours.addEventListener('click', (event) => {
        deleteActivityClient(event.currentTarget.id);
    });
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
    let cours = document.getElementById(id_cours);
    cours.remove();

    
}
const updateInscriptionCoursClient = (cours) => {
    let tdCoursCapaciteCourrante = document.getElementById('Capacite-courante-' + cours.id_cours);

    tdCoursCapaciteCourrante.innerText = cours.nbInscription + ' / ' + cours.capacite;
}


const addCoursServeur = async (event) => {
    event.preventDefault();

    //On met la date en epoch dans la base de donner
    const myDate = date_debut.value;
    const myEpoch = new Date(myDate).getTime();// Your timezone!

    

    let data = {
        nom: nom.value,
        date_debut: myEpoch,
        nb_cours: nb_cours.value,
        capacite: capacite.value,
        description: description.value
    }
    console.log(data);

    let response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        let data = await response.json();
        nom.value = '',
            date_debut.value = '',
            nb_cours.value = '',
            capacite.value = '',
            description.value = ''
    }
}

const deleteActivityServeur = async (event) => {
    event.preventDefault();

    let data = {
        id_cours: event.currentTarget.id
    }

    let response = await fetch('/api/cours', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    location.reload();
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


// Soumission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    //On met la date en epoch dans la base de donner
    const myDate = date_debut.value;
    const myEpoch = new Date(myDate).getTime();// Your timezone!

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


    let response = await fetch('/api/adminvalidation', {
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
        location.reload();
    }
});

for (let checkbox of checkboxes) {
    checkbox.addEventListener('change', checkCoursServeur);
    console.log(checkbox.checked);
}

for (let btn of buttons) {
    btn.addEventListener('click', deleteActivityServeur);
}


for (let btn of boutonAcces) {
    btn.addEventListener('click', changeUserAccessServeur);
}


