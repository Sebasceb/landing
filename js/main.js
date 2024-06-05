let loaded = ( eventLoaded ) => {

    document.getElementById("formulario").addEventListener("submit", function(event) {
        // Detener el comportamiento predeterminado del formulario
        event.preventDefault();
        
        // Verificar la existencia de contenido válido en los elementos del formulario
        var nombre = document.getElementById("nombre").value.trim();
        var email = document.getElementById("email").value.trim();
        
        
        // Validar el nombre
        if (nombre === "") {
            window.alert("Por favor, introduzca su nombre");
        } 
        
        // Validar el email
        if (email === "") {
          window.alert("Por favor, introduzca su email");
        } 
    });
  
    window.alert("landing page loaded");
    console.log( eventLoaded );
    debugger;
    let myform = document.getElementById('formulario');
    myform.addEventListener('submit', ( eventSubmit ) => { 
        debugger;
    })
  
  }
  window.addEventListener("DOMContentLoaded", loaded);


const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const datos = {
    nombre: nombre,
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
        console.log(datos); 
    })
    .catch(error => console.error(error));
});
