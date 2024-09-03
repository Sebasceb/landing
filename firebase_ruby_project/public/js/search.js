
document.getElementById('buscaCarta').addEventListener('submit', function (event) {
    event.preventDefault();

    const cardName = document.getElementById('cardName').value.trim();
    if (!cardName) return;

    fetch(`/buscar_carta/${encodeURIComponent(cardName)}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (data.length === 0) {
                resultsDiv.innerHTML = '<p>No se encontraron cartas.</p>';
            } else {
                data.forEach(card => {
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'card';

                    const cardNameElement = document.createElement('h2');
                    cardNameElement.textContent = card.name;
                    cardDiv.appendChild(cardNameElement);

                    if (card.imageUrl) {
                        const imgElement = document.createElement('img');
                        imgElement.src = card.imageUrl;
                        imgElement.alt = card.name || 'Image';
                        imgElement.style.width = '400px'; 
                        imgElement.style.height = 'auto';
                        cardDiv.appendChild(imgElement);
                    }

                    const typeElement = document.createElement('p');
                    typeElement.textContent = `Tipo: ${card.type}`;
                    cardDiv.appendChild(typeElement);

                    const textElement = document.createElement('p');
                    textElement.textContent = `Texto: ${card.text}`;
                    cardDiv.appendChild(textElement);

                    const cellPrice = document.createElement('td');
                    fetch(`/price/${card.id}`)
                        .then(r => r.json())
                        .then(d => {
                            cellPrice.textContent = `Precio: ${card.type}` || 'Unknown';
                        })
                        .catch(error => {
                            console.error('Error fetching price:', error);
                            cellPrice.textContent = 'Error';
                        });
                    cardDiv.appendChild(cellPrice);

                    //const addButton = document.createElement('button');
                    //addButton.textContent = 'Añadir al carrito';
                    ////addButton.onclick = () => addToCart(card);
                    //cardDiv.appendChild(addButton);

                    resultsDiv.appendChild(cardDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('results').innerHTML = '<p>Error al realizar la búsqueda.</p>';
        });
});

function addToCart(card) {
    fetch('/add_to_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ card }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Carta añadida al carrito');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}