function remplirDonnees(id, titre, desc) {
    document.getElementById('id').value = id;
    document.getElementById('titre').value = titre;
    document.getElementById('description').value = desc;
}
function supprimer(id) {
    let pointFinal = "/ajouter/" + id;
    fetch(pointFinal, {
        method: 'DELETE'
    }
    ).then(
        (response) => response.json()
    ).then(
        (donnee) => window.location.href = donnee.routeRacine
    ).catch(
        (error) => console.log(error)
    )
}

//valider le formulaire et verifier toutes les données
function ValidateForm(){
    var titre = document.getElementById('titre').value;
    var description = document.getElementById('description').value;

    if(titre.trim()=== "" || description.trim() === ""){
        alert("REMPLIR TOUS LES CHAMPS DU FORMULAIRE");
        return false;
}
return true;
}