import {addCoursClient, updateInscriptionCoursClient, deleteActivityClient} from './methode-commune.js'
let buttons = document.querySelectorAll('.liste-boutons');
let tableCoursBody = document.getElementById('cours-table');

const inscrireActivity = (event) => {
    event.preventDefault();

    let data = {
        id_cours: parseInt(event.currentTarget.id),
    }

    fetch('/api/cours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });    
}


for (let btn of buttons) {
    btn.addEventListener('click', inscrireActivity);
}



let source = new EventSource('/stream');

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

source.addEventListener('inscription-cours', (event) => {
    let data = JSON.parse(event.data);
    deleteActivityClient(data.id_cours);
});

