let canvas = document.getElementById("canvasGrafo");

let ctx = canvas.getContext("2d");

let vertices = [];

let aristas = [];

let verticeSeleccionado = null;

let aristaSeleccionada = null;

let moviendoVertice = false;

let modoArista = false;

let verticeOrigen = null;

let verticeDestino = null;

//Elementos del panel de Vertice y edicion
let panelEdicion = document.getElementById("panelEdicion");
let nombreVertice = document.getElementById("nombreVertice");
let colorVertice = document.getElementById("colorVertice");

// Elementos del panel de arista
let panelArista = document.getElementById("panelArista");
let origenArista = document.getElementById("origenArista");
let destinoArista = document.getElementById("destinoArista");

let pesoIda = document.getElementById("pesoIda");

let pesoVuelta = document.getElementById("pesoVuelta");

let contenedorPesoVuelta =
    document.getElementById("contenedorPesoVuelta");

let guardarArista = document.getElementById("guardarArista");
let cancelarArista = document.getElementById("cancelarArista");

let botonEliminarVertice =
    document.getElementById("eliminarVertice");

let botonEliminarArista =
    document.getElementById("eliminarArista");

// Ajustar tamaño del Canvas
function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    dibujarVertices();
}

//dibuja las aristas entre vertices
function dibujarArista(arista) {

    let origen = arista.origen;
    let destino = arista.destino;

    let dx = destino.x - origen.x;
    let dy = destino.y - origen.y;

    let distancia = Math.sqrt(
        dx * dx +
        dy * dy
    );

    if (distancia == 0) {
        return;
    }

    let ux = dx / distancia;
    let uy = dy / distancia;

    // Vector perpendicular
    let px = -uy;
    let py = ux;

    // Separación entre las dos direcciones
    let separacion = 15;

    let inicioX = origen.x + ux * origen.radio;
    let inicioY = origen.y + uy * origen.radio;

    let finalX = destino.x - ux * destino.radio;
    let finalY = destino.y - uy * destino.radio;


    if (arista.bidireccional == false) {

        dibujarDireccion(
            inicioX,
            inicioY,
            finalX,
            finalY,
            origen.color,
            arista.pesoIda
        );

    } else {

        // Dirección origen → destino
        dibujarDireccion(
            inicioX + px * separacion,
            inicioY + py * separacion,
            finalX + px * separacion,
            finalY + py * separacion,
            origen.color,
            arista.pesoIda
        );

        // Dirección destino → origen
        dibujarDireccion(
            finalX - px * separacion,
            finalY - py * separacion,
            inicioX - px * separacion,
            inicioY - py * separacion,
            destino.color,
            arista.pesoVuelta
        );

    }

}

function dibujarDireccion(
    inicioX,
    inicioY,
    finalX,
    finalY,
    color,
    peso
) {

    ctx.beginPath();

    ctx.moveTo(
        inicioX,
        inicioY
    );

    ctx.lineTo(
        finalX,
        finalY
    );

    ctx.strokeStyle = color;

    ctx.lineWidth = 3;

    ctx.stroke();


    // Flecha

    let angulo = Math.atan2(
        finalY - inicioY,
        finalX - inicioX
    );

    dibujarFlecha(
        finalX,
        finalY,
        angulo,
        color
    );


    // Peso

    let medioX =
        (inicioX + finalX) / 2;

    let medioY =
        (inicioY + finalY) / 2;

    ctx.fillStyle = color;

    ctx.font = "16px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "bottom";

    ctx.fillText(
        peso,
        medioX,
        medioY - 5
    );

}

function dibujarFlecha(x, y, angulo, color) {

    let tamaño = 10;

    ctx.beginPath();

    ctx.moveTo(x, y);

    ctx.lineTo(
        x - tamaño * Math.cos(angulo - Math.PI / 6),
        y - tamaño * Math.sin(angulo - Math.PI / 6)
    );

    ctx.lineTo(
        x - tamaño * Math.cos(angulo + Math.PI / 6),
        y - tamaño * Math.sin(angulo + Math.PI / 6)
    );

    ctx.closePath();

    ctx.fillStyle = color;

    ctx.fill();
}

// Dibujar todos los vertices
function dibujarVertices() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    for (let i = 0; i < aristas.length; i++) {

        dibujarArista(aristas[i]);

    }

    for (let i = 0; i < vertices.length; i++) {

        let vertice = vertices[i];

        ctx.beginPath();

        ctx.arc(
            vertice.x,
            vertice.y,
            vertice.radio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = vertice.color;
        ctx.fill();


        // Si el vertice esta seleccionado
        if (vertice === verticeSeleccionado) {

            ctx.lineWidth = 4;
            ctx.strokeStyle = "blue";

        } else {

            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
        }

        ctx.stroke();


        // Nombre del vertice
        ctx.fillStyle = "black";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            vertice.nombre,
            vertice.x,
            vertice.y
        );
    }
}



// Buscar si existe un vertice en la posicion del click
function obtenerVerticeEn(x, y) {

    for (let i = vertices.length - 1; i >= 0; i--) {

        let vertice = vertices[i];

        let distanciaX = x - vertice.x;
        let distanciaY = y - vertice.y;

        let distancia = Math.sqrt(
            distanciaX * distanciaX +
            distanciaY * distanciaY
        );

        if (distancia <= vertice.radio) {

            return vertice;
        }
    }

    return null;
}

function obtenerAristaEn(x, y) {

    for (let i = aristas.length - 1; i >= 0; i--) {

        let arista = aristas[i];

        let origen = arista.origen;
        let destino = arista.destino;

        let dx = destino.x - origen.x;
        let dy = destino.y - origen.y;

        let distancia = Math.sqrt(
            dx * dx +
            dy * dy
        );

        if (distancia == 0) {
            continue;
        }

        let ux = dx / distancia;
        let uy = dy / distancia;

        let px = -uy;
        let py = ux;

        let inicioX = origen.x + ux * origen.radio;
        let inicioY = origen.y + uy * origen.radio;

        let finalX = destino.x - ux * destino.radio;
        let finalY = destino.y - uy * destino.radio;

        let separacion = 12;

        let distanciaLinea;

        if (arista.bidireccional == false) {

            distanciaLinea = distanciaPuntoLinea(
                x,
                y,
                inicioX,
                inicioY,
                finalX,
                finalY
            );

        } else {

            let distanciaIda = distanciaPuntoLinea(
                x,
                y,
                inicioX + px * separacion,
                inicioY + py * separacion,
                finalX + px * separacion,
                finalY + py * separacion
            );

            let distanciaVuelta = distanciaPuntoLinea(
                x,
                y,
                finalX - px * separacion,
                finalY - py * separacion,
                inicioX - px * separacion,
                inicioY - py * separacion
            );

            distanciaLinea = Math.min(
                distanciaIda,
                distanciaVuelta
            );
        }

        if (distanciaLinea <= 10) {

            return arista;
        }
    }

    return null;
}

//supervisar si entre vertice y vertice hay suficiente espacio 
function hayEspacioParaVertice(x, y) {

    for (let i = 0; i < vertices.length; i++) {

        let vertice = vertices[i];

        let distanciaX = x - vertice.x;
        let distanciaY = y - vertice.y;

        let distancia = Math.sqrt(
            distanciaX * distanciaX +
            distanciaY * distanciaY
        );
        // supervisa si los circulos se sobreponen entre si
        if (distancia < vertice.radio * 2) {

            return false;
        }
    }

    return true;
}

// Ajustar Canvas al iniciar
ajustarCanvas();


// Ajustar Canvas cuando cambia el tamaño de la ventana
window.addEventListener("resize", ajustarCanvas);


// Detectar click en el Canvas
canvas.addEventListener("pointerdown", function(event) {

    let rect = canvas.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;


    // Comprobar si hicimos click sobre un vertice
    let verticeEncontrado = obtenerVerticeEn(x, y); //
    let aristaEncontrada = obtenerAristaEn(x, y);

    if (modoArista == true) {

        if (verticeEncontrado != null) {

            if (verticeOrigen == null) {

                verticeOrigen = verticeEncontrado;

                console.log(
                    "Origen seleccionado:",
                    verticeOrigen.nombre
                );

            } else {

                verticeDestino = verticeEncontrado;

                console.log(
                    "Destino seleccionado:",
                    verticeDestino.nombre
                );

                modoArista = false;

                origenArista.textContent = verticeOrigen.nombre;

                destinoArista.textContent = verticeDestino.nombre;

                panelArista.style.display = "block";
            }
        }

        return;
    }

        if (verticeEncontrado != null) {

        // Seleccionar vértice
        verticeSeleccionado = verticeEncontrado;

        // Quitar selección de arista
        aristaSeleccionada = null;

        moviendoVertice = true;

        canvas.setPointerCapture(event.pointerId);

        console.log(
            "Seleccionaste:",
            verticeSeleccionado.nombre
        );

        nombreVertice.value = verticeSeleccionado.nombre;

        colorVertice.value = verticeSeleccionado.color;

        panelEdicion.style.display = "block";

        dibujarVertices();


        } else if (aristaEncontrada != null) {

            // Seleccionar arista
            aristaSeleccionada = aristaEncontrada;

            // Quitar selección de vértice
            verticeSeleccionado = null;

            console.log(
                "Seleccionaste la arista:",
                aristaSeleccionada.origen.nombre,
                "→",
                aristaSeleccionada.destino.nombre
            );

            dibujarVertices();


        } else {

            // Crear nuevo vértice

            if (!hayEspacioParaVertice(x, y)) {

                alert("No puedes crear un vértice tan cerca de otro.");

                return;
            }

            let id = vertices.length + 1;

            let nombre = "V" + id;

            let nuevoVertice = new Vertice(
                id,
                nombre,
                "red",
                x,
                y
            );

            vertices.push(nuevoVertice);

            verticeSeleccionado = null;

            aristaSeleccionada = null;

            dibujarVertices();

        }

});

canvas.addEventListener("pointermove", function(event) {

    if (moviendoVertice == false) {
        return;
    }

    if (verticeSeleccionado == null) {
        return;
    }

    let rect = canvas.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    verticeSeleccionado.x = x;
    verticeSeleccionado.y = y;

    dibujarVertices();

});

canvas.addEventListener("pointerup", function(event) {

    moviendoVertice = false;

}); 

canvas.addEventListener("pointercancel", function(event) {

    moviendoVertice = false;

});

// para que el vertice si o si tenga un nombre, si no lo tiene no se pueda guardar
document.getElementById("guardarVertice").addEventListener("click", function() {

    if (verticeSeleccionado != null) {

        let nombre = nombreVertice.value.trim();

        if (nombre == "") {

            alert("El vértice debe tener un nombre.");

            return;
        }

        verticeSeleccionado.nombre = nombre;

        verticeSeleccionado.color = colorVertice.value;

        dibujarVertices();

        panelEdicion.style.display = "none";

        verticeSeleccionado = null;

    }

});

document.getElementById("crearArista").addEventListener("click", function() {

    modoArista = true;

    verticeOrigen = null;

    console.log("Modo crear arista activado");

});

guardarArista.addEventListener("click", function() {

    if (verticeOrigen == null || verticeDestino == null) {

        alert("Debes seleccionar un origen y un destino.");

        return;
    }

    if (verticeOrigen == verticeDestino) {

    alert("Un vértice no puede conectarse consigo mismo.");

    return;
}

if (existeArista(verticeOrigen, verticeDestino)) {

    alert("Ya existe una arista entre estos vértices.");

    return;
}
    let valorPesoIda = Number(pesoIda.value);

    let valorPesoVuelta = 0;

    let bidireccional = false;


    if (document.getElementById("bidireccional").checked) {

        bidireccional = true;

        valorPesoVuelta = Number(pesoVuelta.value);

    }


    let nuevaArista = new Arista(
        verticeOrigen,
        verticeDestino,
        valorPesoIda,
        valorPesoVuelta,
        bidireccional
    );

    aristas.push(nuevaArista);

    console.log("Arista creada:", nuevaArista);

    panelArista.style.display = "none";

    verticeOrigen = null;

    verticeDestino = null;

    dibujarVertices();

});

cancelarArista.addEventListener("click", function() {

    panelArista.style.display = "none";

    modoArista = false;

    verticeOrigen = null;

    verticeDestino = null;

});

document.getElementById("bidireccional").addEventListener("change", function() {

    if (this.checked) {

        contenedorPesoVuelta.style.display = "block";

    }

});

document.getElementById("unidireccional").addEventListener("change", function() {

    if (this.checked) {

        contenedorPesoVuelta.style.display = "none";

    }

});

function existeArista(origen, destino) {

    for (let i = 0; i < aristas.length; i++) {

        let arista = aristas[i];

        if (
            arista.origen == origen &&
            arista.destino == destino
        ) {

            return true;
        }

        if (
            arista.bidireccional == true &&
            arista.origen == destino &&
            arista.destino == origen
        ) {

            return true;
        }

    }

    return false;
}

function distanciaPuntoLinea(px, py, x1, y1, x2, y2) {

    let dx = x2 - x1;
    let dy = y2 - y1;

    if (dx == 0 && dy == 0) {

        return Math.sqrt(
            (px - x1) * (px - x1) +
            (py - y1) * (py - y1)
        );
    }

    let t = (
        (px - x1) * dx +
        (py - y1) * dy
    ) / (
        dx * dx +
        dy * dy
    );

    if (t < 0) {
        t = 0;
    }

    if (t > 1) {
        t = 1;
    }

    let puntoX = x1 + t * dx;
    let puntoY = y1 + t * dy;

    return Math.sqrt(
        (px - puntoX) * (px - puntoX) +
        (py - puntoY) * (py - puntoY)
    );
}

function eliminarVertice() {

    if (verticeSeleccionado == null) {

        alert("Primero selecciona un vértice.");

        return;
    }

    let vertice = verticeSeleccionado;


    // Eliminar las aristas conectadas al vértice

    for (let i = aristas.length - 1; i >= 0; i--) {

        if (
            aristas[i].origen == vertice ||
            aristas[i].destino == vertice
        ) {

            aristas.splice(i, 1);

        }

    }


    // Eliminar el vértice

    let posicion = vertices.indexOf(vertice);

    if (posicion != -1) {

        vertices.splice(posicion, 1);

    }


    // Limpiar selección

    verticeSeleccionado = null;
    aristaSeleccionada = null;

    // Redibujar

    dibujarVertices();

}

botonEliminarVertice.addEventListener(
    "click",
    eliminarVertice
);

function eliminarArista() {

    if (aristaSeleccionada == null) {

        alert("Primero selecciona una arista.");

        return;
    }


    let posicion =
        aristas.indexOf(aristaSeleccionada);


    if (posicion != -1) {

        aristas.splice(posicion, 1);

    }


    aristaSeleccionada = null;


    dibujarVertices();

}

botonEliminarArista.addEventListener(
    "click",
    eliminarArista
);