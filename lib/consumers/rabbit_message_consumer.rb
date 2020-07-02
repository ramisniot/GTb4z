require 'bunny'
# require 'mqtt'

class MessageConsumer

  attr_reader :config,:connection,:channel,:exchange,:queue,:next_service_time

  def initialize
    @config = {
        host: RABBITMQ_HOST,
        port: RABBITMQ_PORT,
        user: RABBITMQ_USER,
        pass: RABBITMQ_PASSWORD
    }

    @connection = Bunny.new(ENV['CLOUDAMQP_URL'] || @config)
    @connection.start
    # @connection = MQTT::Client.new(ENV['CLOUDAMQP_URL'] || @config)
    # @connection = MQTT::Client.connect(
    #               :host => 'test.mosquitto.org',
    #               :port => 8883,
    #               :ssl => true)
    # @connection.connect()

# -----------------------------------------
# # Publish example
# MQTT::Client.connect('test.mosquitto.org') do |c|
#   c.publish('test', 'message')
# end

# # Subscribe example
# MQTT::Client.connect('test.mosquitto.org') do |c|
#   # If you pass a block to the get method, then it will loop
#   c.get('test') do |topic,message|
#     puts "#{topic}: #{message}"
#   end
# end

# # ---------------------------------


    @channel = @connection.create_channel
    @exchange = @channel.direct(RABBITMQ_PASSWORD_MESSAGES_CHANNEL)

    @queue = @channel.queue($instance_number.to_s, durable: true)
    @queue.bind(@exchange, routing_key: $instance_number.to_s)

    Rails.logger.info "--Rami-#{@channel.inspect}--"
    Rails.logger.info "--Rami-#{@exchange.inspect}--"
    Rails.logger.info "--Rami-#{@queue.inspect}--"
  end


  def process_messages
    $stdout.sync  = true

    EventState::Base.ensure_caching_for_open_trips
     # Rails.logger.info "---#{queue}---"

    service_trip_cache

    queue.subscribe(manual_ack: true, block: true) do |delivery_info, properties, body|
      Rails.logger.info "Message arrival: { message: #{body}, info: #{delivery_info}, properties: #{properties} }"

      EventMessageParser.parse(body)

      Rails.logger.info "...message successful"

      channel.ack(delivery_info.delivery_tag)

      service_trip_cache if Time.now > @next_service_time
    end
  end

  def service_trip_cache
    Rails.logger.info "Check expired trips"


    EventState::Base.end_expired_open_trips
    @next_service_time = Time.now + EventState::Spanning::MAX_EXPIRED_SECONDS.seconds

    Rails.logger.info "Continue queue processing"
  end

end

begin
  consumer = MessageConsumer.new
  consumer.process_messages

rescue
  Rails.logger.info "PROCESS ERROR: #{$!}"
  Rails.logger.info $@

  consumer&.channel&.close
  consumer&.connection&.close
end
