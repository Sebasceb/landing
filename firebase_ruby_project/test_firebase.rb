require_relative 'firebase_service'

def test_connection
  response = firebase_client.get("collection")
  
  if response.success?
    puts "Conexión exitosa! Datos recibidos:"
    puts response.body
  else
    puts "Error al conectar con Firebase. Código de estado: #{response.code}"
  end
end

test_connection
