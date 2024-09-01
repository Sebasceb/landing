# firebase_service.rb

require 'firebase'
# require 'json_web_token' 

FIREBASE_URL = 'https://mtgapp-8c9c9-default-rtdb.firebaseio.com/'
FIREBASE_SECRET = 'your-database-secret'

# Inicializa el cliente de Firebase
def firebase_client
  @firebase ||= Firebase::Client.new(FIREBASE_URL, FIREBASE_SECRET)
end

def fetch_and_store_cards
  cards = fetch_cards # Obtén las cartas usando el método definido

  # Almacena las cartas en Firebase
  cards.each do |card|
    firebase.set("cards/#{card.id}", {
      name: card.name,
      mana_cost: card.mana_cost,
      type: card.type
    })
  end
end