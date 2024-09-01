require_relative 'magic_api'
require_relative 'firebase_service'

def fetch_and_store_cards
  cards = fetch_cards
  return unless cards

  cards.each do |card|
    # Asegúrate de que 'card' es un hash y accede a sus campos correctamente
    card_id = card['id']  # Usa la clave correcta para acceder al ID de la carta
    firebase_client.set("cards/#{card_id}", card)
  end
end

# Llama a la función para probar
fetch_and_store_cards
