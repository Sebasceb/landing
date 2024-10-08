# main.rb
require 'sinatra'
require_relative 'auth'
require_relative 'methods'
require 'httparty'
require 'json'
require 'mtg_sdk'

class MyApp < Sinatra::Base
  set :port, 4567

  def initialize
    super
    @cart = []  # Ensure the cart is initialized as an empty array
  end

  PRECIO_URL = 'https://realtime-database-3e579-default-rtdb.firebaseio.com/data/.json'
  CARTAS_URL = 'https://mtgapp-8c9c9-default-rtdb.firebaseio.com/.json'
  MAGIC_URL = 'https://api.magicthegathering.io/v1/cards'

  def self.fetch_data_from_firebase(url)
    
    response = HTTParty.get(url)
    JSON.parse(response.body)
  end


  # Variables de clase para almacenar los datos
  @@precios_data = nil
  @@cartas_data = nil
  @@cart = []

  # Método para inicializar los datos al cargar el servidor
  def self.initialize_data
    @@precios_data = fetch_data_from_firebase(PRECIO_URL)
    @@cartas_data = fetch_data_from_firebase(CARTAS_URL)
  end

  # Llamada para inicializar los datos al iniciar el servidor
  initialize_data
  

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
    price = find_first_price(card_id)

    content_type :json
    { price: price }.to_json
  end

  get '/cartas' do
    content_type :json
    @@cartas_data.to_json
  end

  get '/buscar_carta/:name' do
    name = params[:name]
    results = search_card_by_name(name)

    content_type :json
    results.to_json
  end

  get '/cart' do
    content_type :json
    @cart.to_json
  end

  # Route to add a card to the cart
  post '/add_to_cart/:id' do
    content_type :json
    begin
      card_id = params[:id]
      card = fetch_card_by_id(card_id)
      if card
        @cart << card
        { success: true, message: 'Card added to cart' }.to_json
      else
        status 404
        { success: false, message: 'Card not found' }.to_json
      end
    rescue => e
      status 500
      { success: false, message: e.message }.to_json
    end
  end

  def fetch_card_by_id(card_id)
    @@cartas_data.find { |card| card['id'] == card_id }
  end
  
  def search_card_by_name(name)
    @@cartas_data['cards'].values.select do |card|
      card_name = card['name']
      card_name && card_name.downcase.include?(name.downcase)
    end
  end


  
  def find_first_price(card_id)
    card_info = @@precios_data[card_id];
    if retail_data = card_info['paper']['cardkingdom']['retail']
    #retail_data = card_info['paper']['cardkingdom']['retail']

        if retail_data['normal']
          retail_data['normal'].values.first
        elsif retail_data['foil']
          retail_data['foil'].values.first
        else
          'Price not found'
        end
    else
        'Price not found'
    end
  end

  # Start the server only if this file is executed directly
  run! if __FILE__ == $PROGRAM_NAME
end
