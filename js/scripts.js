// Fetch cards from Firebase and display them
document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cards-container');

    fetch('https://mtgapp-8c9c9-default-rtdb.firebaseio.com/cards.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const cards = Object.values(data);
                cards.forEach(card => {
                    const cardElement = document.createElement('div');
                    cardElement.classList.add('card');
                    cardElement.innerHTML = `
                        <img src="${card.imageUrl}" alt="${card.name}" class="card-img">
                        <h3 class="card-title">${card.name}</h3>
                        <button class="btn btn-primary" data-id="${card.id}">View Details</button>
                    `;
                    cardsContainer.appendChild(cardElement);
                });
            }
        })
        .catch(error => console.error('Error fetching cards:', error));
});

// Handle card detail view
document.addEventListener('click', event => {
    if (event.target.classList.contains('btn-primary')) {
        const cardId = event.target.getAttribute('data-id');
        fetch(`https://mtgapp-8c9c9-default-rtdb.firebaseio.com/cards/${cardId}.json`)
            .then(response => response.json())
            .then(card => {
                if (card) {
                    // Display card details (you can adjust this part as needed)
                    alert(`Card Name: ${card.name}\nDescription: ${card.description}`);
                }
            })
            .catch(error => console.error('Error fetching card details:', error));
    }
});
