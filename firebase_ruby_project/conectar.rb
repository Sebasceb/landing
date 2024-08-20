require 'mtg_sdk'

# Crear una instancia del cliente de la API
client = MTG::API.new

# Verificar la conexión
begin
  sets = client.sets.all
  puts "Conexión exitosa. Número de sets disponibles: #{sets.count}"
rescue StandardError => e
  puts "Error al conectar con la API: #{e.message}"
end

