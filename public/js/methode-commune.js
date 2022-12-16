
// fonction pour ajouter un nouveau cours dans le client en temps reel
export const addCoursClient = (cours, parent) => {

    let tableCoursBody = parent;

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
    tdCoursDates.innerText = cours.dates;

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

    if(parent.id === 'cours-table'){

        let inputSupprimeCours = document.createElement('input');
        inputSupprimeCours.type = 'button';
        inputSupprimeCours.classList.add('btn');
        inputSupprimeCours.classList.add('btn-danger');
        inputSupprimeCours.classList.add('liste-boutons');
        inputSupprimeCours.name = 'delete';
        inputSupprimeCours.id = cours.id_cours;
        inputSupprimeCours.value = 'Supprimer';
        thCoursBouton.append(inputSupprimeCours);
    }
    else {
        let inputInscrireCours = document.createElement('input');
        inputInscrireCours.type = 'button';
        inputInscrireCours.classList.add('liste-boutons');
        inputInscrireCours.id = cours.id_cours;
        inputInscrireCours.value = 'Inscrire';
        thCoursBouton.append(inputInscrireCours);
    }

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


// fonction pour supprimer un cours dans le client en temps reel
export const deleteActivityClient = (id_cours) => {
    let cours = document.getElementById('cours-row-' + id_cours);
    cours.remove();
}

// update les inscription dans un cours en temps reel
export const updateInscriptionCoursClient = (cours) => {
    let tdCoursCapaciteCourante = document.getElementById('Capacite-courante-' + cours.id_cours);
    tdCoursCapaciteCourante.innerText = cours.nbInscription + ' / ' + cours.capacite;
}