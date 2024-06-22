const mtgColorCombinations = [
    'White',
    'Blue',
    'Black',
    'Red',
    'Green',
    'Azorius',
    'Dimir',
    'Rakdos',
    'Gruul',
    'Selesnya',
    'Orzhov',
    'Izzet',
    'Golgari',
    'Boros',
    'Simic',
    'Bant',
    'Esper',
    'Grixis',
    'Jund',
    'Naya',
    'Abzan',
    'Jeskai',
    'Sultai',
    'Mardu',
    'Temur',
    'Sans White',
    'Sans Blue',
    'Sans Black',
    'Sans Red',
    'Sans Green',
    'WUBRG'
];

const clanToColors = {
    'White': ['White'],
    'Blue': ['Blue'],
    'Black': ['Black'],
    'Red': ['Red'],
    'Green': ['Green'],
    'Azorius': ['White', 'Blue'],
    'Dimir': ['Blue', 'Black'],
    'Rakdos': ['Black', 'Red'],
    'Gruul': ['Red', 'Green'],
    'Selesnya': ['White', 'Green'],
    'Orzhov': ['White', 'Black'],
    'Izzet': ['Blue', 'Red'],
    'Golgari': ['Black', 'Green'],
    'Boros': ['Red', 'White'],
    'Simic': ['Green', 'Blue'],
    'Bant': ['White', 'Blue', 'Green'],
    'Esper': ['White', 'Blue', 'Black'],
    'Grixis': ['Blue', 'Black', 'Red'],
    'Jund': ['Black', 'Red', 'Green'],
    'Naya': ['Red', 'Green', 'White'],
    'Abzan': ['White', 'Black', 'Green'],
    'Jeskai': ['Blue', 'Red', 'White'],
    'Sultai': ['Black', 'Green', 'Blue'],
    'Mardu': ['Red', 'White', 'Black'],
    'Temur': ['Green', 'Blue', 'Red'],
    'Sans White': ['Blue', 'Black', 'Red', 'Green'],
    'Sans Blue': ['White', 'Black', 'Red', 'Green'],
    'Sans Black': ['White', 'Blue', 'Red', 'Green'],
    'Sans Red': ['White', 'Blue', 'Black', 'Green'],
    'Sans Green': ['White', 'Blue', 'Black', 'Red'],
    'WUBRG': ['White', 'Blue', 'Black', 'Red', 'Green']
    // Add other color combinations as needed
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

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

        
        const manaCell = fila.insertCell();
        if (clanToColors[clan]) {
            clanToColors[clan].forEach(color => {
                const img = document.createElement('img');
                img.src = `images/${color}.svg`; 
                img.alt = color;
                img.style.width = '30px'; 
                img.style.marginRight = '5px'; 
                manaCell.appendChild(img);
            });
        }

        
        fila.insertCell().textContent = nombres.length;
    });
}


let loaded = (eventLoaded) => {
    event.preventDefault();
    const formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        var nombre = document.getElementById("nombre").value.trim();
        var clan = capitalizeFirstLetter(document.getElementById("clan").value.trim());
        var email = document.getElementById("email").value.trim();

        if (nombre === "") {
            window.alert("Por favor, introduzca su nombre");
            formulario.focus()
            return;
        }

        if (clan === "") {
            window.alert("Por favor, introduzca su clan");
            formulario.focus()
            return;
        }

        if (!mtgColorCombinations.includes(clan)) {
            window.alert("Por favor, introduzca un clan válido");
            formulario.focus();
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



