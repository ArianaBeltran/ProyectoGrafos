let botonHelp = document.getElementById("btnHelp");

let ventanaHelp = document.getElementById("ventanaHelp");

let cerrarHelp = document.getElementById("cerrarHelp");


botonHelp.addEventListener("click", function() {

    ventanaHelp.style.display = "flex";

});


cerrarHelp.addEventListener("click", function() {

    ventanaHelp.style.display = "none";

});


ventanaHelp.addEventListener("click", function(event) {

    if (event.target == ventanaHelp) {

        ventanaHelp.style.display = "none";

    }

});