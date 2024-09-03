# auth.rb
require 'json'
require 'rest-client'

# URL base de tu Realtime Database de Firebase
AUTH_URL = 'https://lp-project-62a38-default-rtdb.firebaseio.com/users.json'

def register(email, password)
  begin
    user_data = { email: email, password: password, items: [] }
    response = RestClient.post(AUTH_URL, user_data.to_json, { content_type: :json, accept: :json })
    { success: true, message: 'User registered successfully', data: JSON.parse(response.body) }
  rescue RestClient::ExceptionWithResponse => e
    { success: false, message: e.response.body }
  rescue JSON::ParserError => e
    { success: false, message: 'Invalid JSON format' }
  rescue StandardError => e
    { success: false, message: e.message }
  end
end


def login(email, password)
  begin
    response = RestClient.get(AUTH_URL)
    users = JSON.parse(response.body)

    user = users.find { |key, data| data['email'] == email && data['password'] == password }

    if user
      { success: true, message: "Login successful for user: #{email}" }
    else
      { success: false, message: 'Invalid email or password' }
    end
  rescue RestClient::ExceptionWithResponse => e
    { success: false, message: e.response.body }
  rescue JSON::ParserError => e
    { success: false, message: 'Invalid JSON format' }
  rescue StandardError => e
    { success: false, message: e.message }
  end
end
