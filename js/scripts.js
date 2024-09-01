// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://mtgapp-8c9c9-default-rtdb.firebaseio.com/.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched from Firebase:', data); // Debugging line
            displayCards(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function displayCards(data) {
    const tableBody = document.getElementById('tablebody');

    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear existing content

    // Ensure data is an object and contains keys
    if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const card = data[key];
                const row = document.createElement('tr');

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

                // Image
                const cellImage = document.createElement('td');
                const img = document.createElement('img');
                img.src = card.imageUrl || '';
                img.alt = card.name || 'Image';
                img.style.width = '100px'; // Adjust size as needed
                img.style.height = 'auto';
                cellImage.appendChild(img);
                row.appendChild(cellImage);

                tableBody.appendChild(row);
            }
        }
    } else {
        console.log('No data available or data structure is not as expected.'); // Debugging line
    }
}
