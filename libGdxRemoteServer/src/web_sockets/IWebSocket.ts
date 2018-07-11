export enum SocketStatus {
  connected,
  authorized,
  disconnected
}

export const Events = {
  On: {
    connection: 'connection',
    isReady: 'is-ready',
    disconnect: 'disconnect',
    geoLocation: 'geo-location-from-sender',
    touchEvent: 'touch-event-from-sender',
    accelerometerEvent: 'accelerometer-event-from-sender'
  },
  Emit: {
    geoLocation: 'geo-location-to-receiver',
    touchEvent: 'touch-event-to-receiver',
    accelerometerEvent: 'accelerometer-event-to-receiver',
    readyReceived: 'ready-received'
  }
}

export interface IData {
  sequenceNumber: number,
  timeStamp: number,
  info: any[]
}

export interface IClientData {
  lastSequenceNumber: number,
  rule: SocketRules
}

export type SocketRules = 'receiver' | 'sender'
