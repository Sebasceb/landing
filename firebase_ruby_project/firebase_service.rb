# firebase_service.rb

require 'firebase'
require 'json_web_token'

FIREBASE_URL = 'https://your-project-id.firebaseio.com/' # Replace with your Firebase Realtime Database URL
FIREBASE_SECRET = 'your-database-secret' # Get this from Firebase Console under "Database" settings

# Initialize the Firebase client
firebase = Firebase::Client.new(FIREBASE_URL, FIREBASE_SECRET)

def firebase_client
  @firebase ||= Firebase::Client.new(FIREBASE_URL, FIREBASE_SECRET)
end