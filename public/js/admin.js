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


const checkCoursServeur = (event) => {
    let data = {
        id: event.currentTarget.dataset.id
    }

    fetch('/api/cours', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

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

const addCoursServeur = async (event) => {
    event.preventDefault();

    //On met la date en epoch dans la base de donner
    const myDate = date_debut.value;
    const myEpoch = new Date(myDate).getTime();// Your timezone!

    console.log(myEpoch);
    console.log(myDate);

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


for (let capacite of capaciteC) {
    console.log(capacite);
}