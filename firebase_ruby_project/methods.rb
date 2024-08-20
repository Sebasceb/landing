require 'rest-client'
require 'json'

# URL base de tu Realtime Database
BASE_URL = 'https://lp-project-62a38-default-rtdb.firebaseio.com/users'

# Función para agregar un ítem al array de un usuario
def add_item_to_user(email, item)
  # Buscar el usuario por email
  users_url = "#{BASE_URL}.json"
  begin
    response = RestClient.get(users_url)
    users = JSON.parse(response.body)
    
    user_id = users.find { |key, data| data['email'] == email }&.first

    if user_id
      # URL específica del usuario
      url = "#{BASE_URL}/#{user_id}/items.json"

      # Obtener los ítems actuales
      items_response = RestClient.get(url)
      items = JSON.parse(items_response.body) || []

      # Agregar el nuevo ítem
      items.push(item)

      # Actualizar el array en la base de datos
      RestClient.patch(url, items.to_json, { content_type: :json, accept: :json })
      puts "Item added successfully"
    else
      puts "User not found"
    end
  rescue RestClient::ExceptionWithResponse => e
    error_message = JSON.parse(e.response.body)['error']['message']
    puts "Error adding item: #{error_message}"
  end
end

def get_user_data(email)
  # Buscar el usuario por email
  users_url = "#{BASE_URL}.json"
  begin
    response = RestClient.get(users_url)
    users = JSON.parse(response.body)
    
    user_id = users.find { |key, data| data['email'] == email }&.first

    if user_id
      # URL específica del usuario
      url = "#{BASE_URL}/#{user_id}.json"

      # Obtener los datos del usuario
      user_response = RestClient.get(url)
      user_data = JSON.parse(user_response.body)
      puts "User data: #{user_data}"
      user_data
    else
      puts "User not found"
      nil
    end
  rescue RestClient::ExceptionWithResponse => e
    error_message = JSON.parse(e.response.body)['error']['message']
    puts "Error getting user data: #{error_message}"
  end
end
