// scripts.js
var prices = {} ;

document.addEventListener('DOMContentLoaded', () => {
    fetch('/cartas')
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched from Firebase:', data); // Debugging line
            displayCards(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function displayCards(cartas) {
    const tableBody = document.getElementById('tablebody');

    if (!tableBody) return;

    tableBody.innerHTML = " "; // Clear existing content

    // Ensure data is an object and contains keys
    if (typeof cartas.cards === 'object' && cartas.cards !== null) {
        for (const key in cartas.cards) {
            if (cartas.cards.hasOwnProperty(key)) {
                const card = cartas.cards[key];
                const row = document.createElement('tr');

                // Image
                const cellImage = document.createElement('td');
                const img = document.createElement('img');
                img.src = card.imageUrl || '';
                img.alt = card.name || 'Image';
                img.style.width = '100px'; // Adjust size as needed
                img.style.height = 'auto';
                cellImage.appendChild(img);
                row.appendChild(cellImage);

                // Name
                const cellName = document.createElement('td');
                cellName.textContent = card.name || 'Unknown';
                row.appendChild(cellName);

                // Type
                const cellType = document.createElement('td');
                cellType.textContent = card.type || 'Unknown';
                row.appendChild(cellType);

                // Rarity
                const cellRarity = document.createElement('td');
                cellRarity.textContent = card.rarity || 'Unknown';
                row.appendChild(cellRarity);

                const cellPrice = document.createElement('td');
                fetch(`/price/${key}`) 
                    .then(response => response.json())
                    .then(data => {
                        cellPrice.textContent = data.price || 'Unknown';
                    })
                    .catch(error => {
                        console.error('Error fetching price:', error);
                        cellPrice.textContent = 'Error';
                    });
                row.appendChild(cellPrice);

                tableBody.appendChild(row);
            }
        }
    } else {
        console.log('No data available or data structure is not as expected.'); // Debugging line
    }
}

