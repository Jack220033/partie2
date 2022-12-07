let ul = document.getElementById('liste-compte');
let desincrireBtn = document.getElementById('desincrire');
let button = document.querySelectorAll('.liste-boutons')
let checkboxes = document.querySelectorAll('#liste-cours input');

const desincrireCoursServeur = async (event) => {

    let data = {
        id_cours: event.currentTarget.id,
        id_utilisateur: 1
        id_cours: event.currentTarget.id
    }
    console.log(data);
    


    fetch('/api/compte', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    location.reload();
}

for (let btn of button) {
    btn.addEventListener('click', desincrireCoursServeur);
}

