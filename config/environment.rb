# Load the rails application
require 'json'
require File.expand_path('../application', __FILE__)

# TODO re-enable if/when we return to KAFKA
# KAFKA_BROKERS = JSON.parse(ENV['KAFKA_BROKERS'] || "[]")
# MESSAGES_TOPIC = ENV['MESSAGES_TOPIC'] || ''
# MESSAGES_PARTITIONS = Integer(ENV['MESSAGES_PARTITIONS'] || 1)
# KAFKA_RETRIES = Integer(ENV['KAFKA_RETRIES'] || 10)
# KAFKA_CLIENT_ID = ENV['KAFKA_CLIENT_ID']
# KAFKA_MAX_BUFFER_SIZE = Integer(ENV['KAFKA_MAX_BUFFER_SIZE'] || 5000)
# KAFKA_MAX_BUFFER_BYTE_SIZE = Integer(ENV['KAFKA_MAX_BUFFER_BYTE_SIZE'] || 5000000)
# SAVE_MESSAGES_CONSUMER_GROUP = ENV['SAVE_MESSAGES_CONSUMER_GROUP']

QIOT_IO_API_TOKEN = ENV['QIOT_IO_API_TOKEN'] || 'test-token'
QIOT_ACCOUNT_TOKEN = ENV['QIOT_ACCOUNT_TOKEN'] || 'test-token'

RABBITMQ_HOST = ENV['RABBITMQ_HOST'] || ''
RABBITMQ_PORT = ENV['RABBITMQ_PORT'] || ''
RABBITMQ_USER = ENV['RABBITMQ_USER'] || ''
RABBITMQ_PASSWORD = ENV['RABBITMQ_PASSWORD'] || ''
RABBITMQ_PASSWORD_MESSAGES_CHANNEL = ENV['RABBITMQ_PASSWORD_MESSAGES_CHANNEL'] || 'messages'
RABBITMQ_CONSUMER_INSTANCES = Integer(ENV['RABBITMQ_CONSUMER_INSTANCES'] || 1)
QIOT_ACCOUNT_TOKEN_IDENTIFIER = ENV['QIOT_ACCOUNT_TOKEN_IDENTIFIER'] || ''
QIOT_USER_SERVICE_URL = ENV['QIOT_USER_SERVICE_URL'] || ''
QIOT_GEOCODING_SERVICE_URL = ENV['QIOT_GEOCODING_SERVICE_URL'] || ''
QIOT_SSL = !(['development'].include? Rails.env)

ENABLE_QIOT_SYNC = ENV['ENABLE_QIOT_SYNC'] ? ENV['ENABLE_QIOT_SYNC'] == 'true' : QIOT_SSL

# Initialize the rails application
GoTrack::Application.initialize!

DEFAULT_MAP_TYPE    = ENV['DEFAULT_MAP_TYPE'] || 'roadmap'
GOOGLE_MAPS_API_KEY = ENV['GOOGLE_MAPS_API_KEY'] || 'AIzaSyDKiD1FFTqlWQwhroHnqgyDO234SWRKHpA'
# GOOGLE_MAPS_API_KEY = 'AIzaSyBhr4gzsfy_SAmK-yl-lWdQsRsD0Na57ho'
													   


# GOOGLE_MAPS_API_KEY = ENV['GOOGLE_MAPS_API_KEY'] || 'AIzaSyCSzobmnOSShyEM6i3yohtc9rFe32M1Iu8'
