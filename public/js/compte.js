import { addCoursClient, updateInscriptionCoursClient, deleteActivityClient } from "./methode-commune.js";

let ul = document.getElementById('liste-compte');
let desincrireBtn = document.getElementById('desincrire');
let button = document.querySelectorAll('.liste-boutons')
let checkboxes = document.querySelectorAll('#liste-cours input');
let tableCoursBody = document.getElementById('cours-table');

let source = new EventSource('/stream');

// fonction pour la desinscription a un cours
const desincrireCoursServeur = async (event) => {

    let data = {
        id_cours: parseInt(event.currentTarget.id),
    }
    


    fetch('/api/compte', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
}

for (let btn of button) {
    btn.addEventListener('click', desincrireCoursServeur);
}


// evenement temps reel
source.addEventListener('add-cours', (event) => {
    let data = JSON.parse(event.data)
    addCoursClient(data, tableCoursBody);
})

source.addEventListener('inscription-cours-update', (event) => {
    let data = JSON.parse(event.data);
    updateInscriptionCoursClient(data);
});

source.addEventListener('desinscription-cours-update', (event) => {
    let data = JSON.parse(event.data);
    updateInscriptionCoursClient(data);
});

source.addEventListener('desinscription-cours', (event) => {
    let data = JSON.parse(event.data);
    deleteActivityClient(data.id_cours);
});

