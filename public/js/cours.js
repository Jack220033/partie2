let buttons = document.querySelectorAll('.liste-boutons');

const inscrireActivity = (event) => {
    event.preventDefault();

    let data = {
        id_cours: event.currentTarget.id        
    }

    fetch('/api/cours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    location.reload();
}

for (let btn of buttons) {
    btn.addEventListener('click', inscrireActivity);
}

let source = new EventSource('/stream');

source.addEventListener('add-cours', (event) => {
    let data = JSON.parse(event.data)
    addCoursClient(data.id, data.nom, data.description, data.capacite, data.date_debut, data.nb_cours, false);
})

/*
source.addEventListener('check-todo', (event) => {
    let data = JSON.parse(event.data)
    let checkbox = document.querySelector(`input[data-id="${data.id}"]`);
    checkbox.checked = !checkbox.checked
})
*/