# magic_api.rb
require 'rest-client'
require 'json'

# Configura el endpoint del API de Magic: The Gathering
API_URL = 'https://api.magicthegathering.io/v1/cards'

# Método para obtener cartas
def fetch_cards
  begin
    response = RestClient.get(API_URL)
    cards_data = JSON.parse(response.body)
    puts cards_data  # Agrega esta línea para ver la estructura completa
    cards_data['cards']  # Ajusta esto según el formato de los datos que devuelve el API
  rescue RestClient::ExceptionWithResponse => e
    puts "Error al conectar con el API de Magic: The Gathering: #{e.response}"
    nil
  end
end

