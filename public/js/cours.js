let buttons = document.querySelectorAll('.liste-boutons');

const inscrireActivity = (event) => {
    event.preventDefault();

    let data = {
        id_cours: event.currentTarget.id,
        id_utilisateur: 1
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