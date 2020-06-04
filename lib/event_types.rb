require 'enum_factory'

EventTypes = EnumFactory.factory(
    'EventTypes', :name, :id,
    'Panic'                           => 0,
    'EngineOff'                       => 1,
    'EngineOn'                        => 2,
    'Speed'                           => 3,
    'Idling'                          => 4,
    'PlugIn'                          => 5,
    'NoGPS'                           => 6,
    'Requested'                       => 7,
    'LowBattery'                      => 8,
    'Heartbeat'                       => 9,
    'Motion'                          => 10,
    'Ignition'                        => 11,
    'GeofenceEnter'                   => 12,
    'GeofenceExit'                    => 13,
    'Offline'                         => 14,
    'Stop'                            => 15,
    'Trip'                            => 16,
    'AssetHighHigh'                   => 17,
    'AssetHigh'                       => 18,
    'AssetLow'                        => 19,
    'AssetLowLow'                     => 20,
    'AssetLeak'                       => 21,
    'AssetHighToLow'                  => 22,
    'AssetLowToHigh'                  => 23,
    'Maintenance'                     => 24,
    'StartMotion'                     => 25,
    'StopMotion'                      => 26,
    'HealthAlert'                     => 27,
    'GeofenceDwellTimeExceeded'       => 28,
    'UnknownDwellTimeExceeded'        => 29,
    'CutWire'                         => 30,
    'DiagnosticData'                  => 31,
    'PowerUp'                         => 32,
    'MotionAlarm'                     => 33,
    'Tamper'                          => 34,
    'TemperatureAlarm'                => 35,
    'TemperatureAlarmCleared'         => 36,
)
