# main.rb
require 'sinatra'
require_relative 'auth'
require_relative 'methods'

class MyApp < Sinatra::Base
  set :port, 4567

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

  # Start the server only if this file is executed directly
  run! if __FILE__ == $PROGRAM_NAME
end
