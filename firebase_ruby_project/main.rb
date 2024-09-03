# main.rb
require 'sinatra'
require_relative 'auth'
require_relative 'methods'
require 'httparty'
require 'json'

class MyApp < Sinatra::Base
  set :port, 4567

  PRECIO_URL = 'https://realtime-database-3e579-default-rtdb.firebaseio.com/data/.json'
  CARTAS_URL = 'https://mtgapp-8c9c9-default-rtdb.firebaseio.com/.json'
  MAGIC_URL = 'https://api.magicthegathering.io/v1/cards'

  # Ruta para la página principal (index.html)
  get '/' do
    # Sinatra servirá automáticamente index.html desde el directorio 'public'
    send_file File.join(settings.public_folder, 'index.html')
  end

  post '/register' do
    content_type :json
    begin
      # Lee el cuerpo de la solicitud directamente
      user_data = JSON.parse(request.body.read)
      email = user_data['email']
      password = user_data['password']
      result = register(email, password)
      result.to_json
    rescue JSON::ParserError => e
      status 400
      { success: false, message: 'Invalid JSON format' }.to_json
    end
  end

  post '/login' do
    content_type :json
    begin
      # Lee el cuerpo de la solicitud directamente
      user_data = JSON.parse(request.body.read)
      email = user_data['email']
      password = user_data['password']
      result = login(email, password)
      result.to_json
    rescue JSON::ParserError => e
      status 400
      { success: false, message: 'Invalid JSON format' }.to_json
    end
  end

  # Ruta para agregar un ítem a un usuario
  post '/add_item' do
    content_type :json
    begin
      data = JSON.parse(request.body.read)
      email = data['email']
      item = data['item']
      add_item_to_user(email, item)
      { success: true, message: 'Item added successfully' }.to_json
    rescue JSON::ParserError
      status 400
      { success: false, message: 'Invalid JSON format' }.to_json
    end
  end

  # Ruta para obtener los datos de un usuario
  get '/get_user_data/:email' do
    content_type :json
    begin
      email = params[:email]
      user_data = get_user_data(email)
      if user_data
        user_data.to_json
      else
        status 404
        { success: false, message: 'User not found' }.to_json
      end
    rescue => e
      status 500
      { success: false, message: e.message }.to_json
    end
  end

  get '/price/:card_id' do
    card_id = params[:card_id]
    data = fetch_data_from_firebase(PRECIO_URL)
    price = find_first_price(data, card_id)

    content_type :json
    { price: price }.to_json
  end

  get '/cartas' do
    content_type :json
    data = fetch_data_from_firebase(CARTAS_URL)
    data.to_json
  end


  def fetch_data_from_firebase(url)
    
    response = HTTParty.get(url)
    JSON.parse(response.body)
  end

  def find_first_price(data, card_id)
    card_info = data[card_id]

    retail_data = card_info['cardkingdom']['retail']

    if retail_data['normal'].nil? 
      retail_data['foil'].values.first
    elsif retail_data['foil'].nil?
      retail_data['normal'].values.first
    else
      'Price not found 1'
    end
  end

  # Start the server only if this file is executed directly
  run! if __FILE__ == $PROGRAM_NAME
end
