let botonHelp = document.getElementById("btnHelp");

let ventanaHelp = document.getElementById("ventanaHelp");

let cerrarHelp = document.getElementById("cerrarHelp");

let guardarGrafo = document.getElementById("guardarGrafo");

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

//===============
//GUARDAR GRAFO
//===============
guardarGrafo.addEventListener(
    "click",
    function() {

        // Comprobar que exista al menos un vértice
        if (vertices.length == 0) {
            alert("No hay ningún vértice para guardar.");
            return;
        }

        // Pedir nombre del grafo
        let nombreGrafo = prompt(
            "Ingresa un nombre para el grafo:"
        );

        // Si cancela
        if (nombreGrafo == null) {
            return;
        }

        // Quitar espacios innecesarios
        nombreGrafo = nombreGrafo.trim();

        // Comprobar que haya escrito un nombre
        if (nombreGrafo == "") {
            alert("Debes ingresar un nombre para el grafo.");
            return;
        }

        // Guardar los vértices
        let datosVertices = [];

        for (let i = 0; i < vertices.length; i++) {

            datosVertices.push({
                id: vertices[i].id,
                nombre: vertices[i].nombre,
                color: vertices[i].color,
                x: vertices[i].x,
                y: vertices[i].y,
                radio: vertices[i].radio
            });
        }

        // Guardar las aristas
        let datosAristas = [];

        for (let i = 0; i < aristas.length; i++) {

            datosAristas.push({
                origenId: aristas[i].origen.id,
                destinoId: aristas[i].destino.id,
                pesoIda: aristas[i].pesoIda,
                pesoVuelta: aristas[i].pesoVuelta,
                dirigida: aristas[i].dirigida,
                bidireccional: aristas[i].bidireccional
            });
        }

        // Crear objeto del grafo
        let grafoGuardado = {
            nombre: nombreGrafo,
            vertices: datosVertices,
            aristas: datosAristas
        };

        // Obtener los grafos que ya están guardados
        let grafosGuardados =
            JSON.parse(
                localStorage.getItem("grafos")
            );

        // Si no existen grafos guardados
        if (grafosGuardados == null) {
            grafosGuardados = [];
        }

        // Agregar el nuevo grafo
        grafosGuardados.push(grafoGuardado);

        // Guardar en localStorage
        localStorage.setItem(
            "grafos",
            JSON.stringify(grafosGuardados)
        );

        alert(
            "El grafo '" +
            nombreGrafo +
            "' se guardó correctamente."
        );
    }
);

// ===============================
// ABRIR GRAFO
// ===============================

let abrirGrafo =
    document.getElementById("abrirGrafo");

let ventanaGrafos =
    document.getElementById("ventanaGrafos");

let listaGrafos =
    document.getElementById("listaGrafos");

let cerrarGrafos =
    document.getElementById("cerrarGrafos");


abrirGrafo.addEventListener(
    "click",
    function() {

        mostrarGrafos();

        ventanaGrafos.style.display =
            "flex";
    }
);


// ===============================
// MOSTRAR GRAFOS GUARDADOS
// ===============================

function mostrarGrafos() {

    listaGrafos.innerHTML = "";

    let grafosGuardados =
        JSON.parse(
            localStorage.getItem(
                "grafos"
            )
        );

    // No hay grafos
    if (
        grafosGuardados == null ||
        grafosGuardados.length == 0
    ) {

        listaGrafos.innerHTML =
            "<p>No hay grafos guardados.</p>";

        return;
    }

    // Recorrer grafos
    for (
        let i = 0;
        i < grafosGuardados.length;
        i++
    ) {

        let contenedor =
            document.createElement(
                "div"
            );

        contenedor.className =
            "grafoGuardado";


        // Nombre
        let nombre =
            document.createElement(
                "span"
            );

        nombre.className =
            "nombreGrafo";

        nombre.textContent =
            grafosGuardados[i].nombre;


        // Botón abrir
        let botonAbrir =
            document.createElement(
                "button"
            );

        botonAbrir.className =
            "botonAbrir";

        botonAbrir.textContent =
            "Abrir";


        // Botón eliminar
        let botonEliminar =
            document.createElement(
                "button"
            );

        botonEliminar.className =
            "botonEliminar";

        botonEliminar.textContent =
            "Eliminar";


        // Acción abrir
        botonAbrir.addEventListener(
            "click",
            function() {

                cargarGrafo(i);

                ventanaGrafos.style.display =
                    "none";
            }
        );


        // Acción eliminar
        botonEliminar.addEventListener(
            "click",
            function() {

                let confirmar =
                    confirm(
                        "¿Estás seguro que quieres eliminar el grafo?"
                    );

                if (
                    confirmar
                ) {

                    grafosGuardados.splice(
                        i,
                        1
                    );

                    localStorage.setItem(
                        "grafos",
                        JSON.stringify(
                            grafosGuardados
                        )
                    );

                    mostrarGrafos();
                }
            }
        );


        // Agregar elementos
        contenedor.appendChild(
            nombre
        );

        contenedor.appendChild(
            botonAbrir
        );

        contenedor.appendChild(
            botonEliminar
        );

        listaGrafos.appendChild(
            contenedor
        );
    }
}


// ===============================
// CERRAR VENTANA
// ===============================

cerrarGrafos.addEventListener(
    "click",
    function() {

        ventanaGrafos.style.display =
            "none";
    }
);


// ===============================
// CARGAR GRAFO
// ===============================

// ===============================
// CARGAR GRAFO
// ===============================

function cargarGrafo(indice) {

    let grafosGuardados =
        JSON.parse(
            localStorage.getItem("grafos")
        );

    let grafo =
        grafosGuardados[indice];


    // Vaciar el grafo actual
    vertices.length = 0;
    aristas.length = 0;


    // =================================
    // CREAR LOS VÉRTICES
    // =================================

    for (
        let i = 0;
        i < grafo.vertices.length;
        i++
    ) {

        let datos =
            grafo.vertices[i];


        // El constructor de Vertice es:
        // id, nombre, color, x, y

        let nuevoVertice =
            new Vertice(
                datos.id,
                datos.nombre,
                datos.color,
                datos.x,
                datos.y
            );


        nuevoVertice.radio =
            datos.radio;


        vertices.push(
            nuevoVertice
        );
    }


    // =================================
    // CREAR LAS ARISTAS
    // =================================

    for (
        let i = 0;
        i < grafo.aristas.length;
        i++
    ) {

        let datos =
            grafo.aristas[i];


        let origen = null;
        let destino = null;


        // Buscar vértice origen

        for (
            let j = 0;
            j < vertices.length;
            j++
        ) {

            if (
                vertices[j].id ==
                datos.origenId
            ) {

                origen =
                    vertices[j];

                break;
            }
        }


        // Buscar vértice destino

        for (
            let j = 0;
            j < vertices.length;
            j++
        ) {

            if (
                vertices[j].id ==
                datos.destinoId
            ) {

                destino =
                    vertices[j];

                break;
            }
        }


        // Crear la arista

        if (
            origen != null &&
            destino != null
        ) {

            let nuevaArista =
                new Arista(
                    origen,
                    destino,
                    datos.pesoIda,
                    datos.pesoVuelta,
                    datos.dirigida,
                    datos.bidireccional
                );


            // Mantener información de bucle

            if (
                datos.origenId ==
                datos.destinoId
            ) {

                nuevaArista.bucle = true;

            } else {

                nuevaArista.bucle = false;
            }


            aristas.push(
                nuevaArista
            );
        }
    }


    // =================================
    // REDIBUJAR
    // =================================

    dibujarVertices();


    alert(
        "El grafo '" +
        grafo.nombre +
        "' se abrió correctamente."
    );
}

// MATRIZ DE ADYACENCIA

let mostrarMatriz = document.getElementById("mostrarMatriz");
let ventanaMatriz = document.getElementById("ventanaMatriz");
let tablaMatriz = document.getElementById("tablaMatriz");
let cerrarMatriz = document.getElementById("cerrarMatriz");

mostrarMatriz.addEventListener("click", function() {

    if (vertices.length == 0) {
        alert("No hay ningún vértice para mostrar.");
        return;
    }

    crearMatrizAdyacencia();

    ventanaMatriz.style.display = "flex";
});

cerrarMatriz.addEventListener("click", function() {
    ventanaMatriz.style.display = "none";
});

ventanaMatriz.addEventListener("click", function(event) {
    if (event.target == ventanaMatriz) {
        ventanaMatriz.style.display = "none";
    }
});


function crearMatrizAdyacencia() {

    let n = vertices.length;

    // Crear matriz llena de ceros
    let matriz = [];

    for (let i = 0; i < n; i++) {

        matriz[i] = [];

        for (let j = 0; j < n; j++) {
            matriz[i][j] = 0;
        }
    }

    // Recorrer todas las aristas
    for (let i = 0; i < aristas.length; i++) {

        let arista = aristas[i];

        let posicionOrigen = -1;
        let posicionDestino = -1;

        // Buscar posición del origen
        for (let j = 0; j < n; j++) {

            if (vertices[j].id == arista.origen.id) {
                posicionOrigen = j;
            }

            if (vertices[j].id == arista.destino.id) {
                posicionDestino = j;
            }
        }

        if (posicionOrigen != -1 && posicionDestino != -1) {

            // Si es una arista dirigida
            if (arista.dirigida == true) {

                matriz[posicionOrigen][posicionDestino] =
                    arista.pesoIda;

                // Si es bidireccional
                if (arista.bidireccional == true) {

                    matriz[posicionDestino][posicionOrigen] =
                        arista.pesoVuelta;
                }

            } else {

                // Arista no dirigida
                matriz[posicionOrigen][posicionDestino] =
                    arista.pesoIda;

                matriz[posicionDestino][posicionOrigen] =
                    arista.pesoIda;
            }
        }
    }

    // Crear la tabla HTML
    let tabla = "<table>";

    // Primera fila
    tabla += "<tr>";
    tabla += "<th></th>";

    for (let i = 0; i < n; i++) {
        tabla += "<th>" + vertices[i].nombre + "</th>";
    }

    tabla += "</tr>";

    // Filas de la matriz
    for (let i = 0; i < n; i++) {

        tabla += "<tr>";

        // Nombre del vértice
        tabla += "<th>" + vertices[i].nombre + "</th>";

        for (let j = 0; j < n; j++) {

            tabla += "<td>" + matriz[i][j] + "</td>";
        }

        tabla += "</tr>";
    }

    tabla += "</table>";

    tablaMatriz.innerHTML = tabla;
}