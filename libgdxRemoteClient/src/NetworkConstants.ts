export const Urls = {
  baseUrl : 'http://192.168.1.2:8001'
}

export const Events = {
  On: {
    geoLocation: 'geo-location-to-receiver',
    touchEvent: 'touch-event-to-receiver',
    accelerometerEvent: 'accelerometer-event-to-receiver',
    readyReceived: 'ready-received',
    disconnect: 'disconnect',
    connect: 'connect',
    connectError: 'connect_error',
    error: 'error'
  },
  Emit: {
    isReady: 'is-ready',
    geoLocation: 'geo-location-from-sender',
    touchEvent: 'touch-event-from-sender',
    accelerometerEvent: 'accelerometer-event-from-sender'
  }
}

export const ClientRule = 'sender'
