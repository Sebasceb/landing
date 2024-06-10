async function obtenerDatos() {
    const url = 'https://realtime-database-3e579-default-rtdb.firebaseio.com/collection.json';
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        console.error("Error:", respuesta.status);
        return;
    }
    const datosJSON = await respuesta.json();
    const mapaClanNombre = new Map();
    for (const key in datosJSON) {
        const { clan, nombre } = datosJSON[key];
        if (mapaClanNombre.has(clan)) {
            mapaClanNombre.get(clan).push(nombre);
        } else {
            mapaClanNombre.set(clan, [nombre]);
        }
    }
    const cuerpoTabla = document.getElementById('tablebody');

    cuerpoTabla.innerHTML = '';
    mapaClanNombre.forEach((nombres, clan) => {
        const fila = cuerpoTabla.insertRow();
        fila.insertCell().textContent = clan;
        fila.insertCell().textContent = nombres.length;
    });
}


let loaded = (eventLoaded) => {
    event.preventDefault();
    const formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        var nombre = document.getElementById("nombre").value.trim().toUpperCase();
        var clan = document.getElementById("clan").value.trim().toUpperCase();
        var email = document.getElementById("email").value.trim().toUpperCase();

        if (nombre === "") {
            window.alert("Por favor, introduzca su nombre");
            formulario.focus()
            return;
        }

        if (email === "") {
            window.alert("Por favor, introduzca su clan");
            formulario.focus()
            return;
        }

        if (email === "") {
            window.alert("Por favor, introduzca su email");
            formulario.focus()
            return;
        }

        const datos = {
            nombre: nombre,
            clan: clan,
            email: email
        };
        fetch('https://realtime-database-3e579-default-rtdb.firebaseio.com/collection.json', {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(respuesta => respuesta.json())
            .then(datos => {
                alert("¡Tu respuesta ha sida guardada!")
                obtenerDatos()
            })
            .catch(error => console.error(error));
    });

    obtenerDatos()
}


window.addEventListener("DOMContentLoaded", loaded);



