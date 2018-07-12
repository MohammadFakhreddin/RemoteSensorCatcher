import SocketIO from 'socket.io'
import { NetworkVariables } from '../Config'
import { PacketFactory } from '../models/PacketFactory'
import { Logger } from '../utils/Logger'
import {
  Events,
  IClientData,
  IData,
  SocketRules
} from './IWebSocket'

export class ChatServer {
  private io: SocketIO.Server = null
  private receiverSocketId: string = null
  public constructor(server) {
    this.io = SocketIO(server, {
      transports: ['websocket']
    })
    this.io.on(Events.On.connection, this.connection)
  }
  private connection = (socket: SocketIO.Socket): void => {
    const clientData: IClientData = {
      lastSequenceNumber: -1,
      rule: null
    }
    socket.on(Events.On.isReady, (rawData: IData) => {
      const packet = PacketFactory.generatePacketObject(rawData)
      if (clientData.lastSequenceNumber < packet.sequenceNumber) {
        clientData.lastSequenceNumber = packet.sequenceNumber
        socket.emit(Events.Emit.readyReceived)
        const rule = packet.info[0] as SocketRules
        if (rule === 'receiver') {
          this.receiverSocketId = socket.id
          Logger.log(`Receiver connected with id ${socket.id}`)
        } else {
          Logger.log(`Sender connected with id ${socket.id}`)
        }
        clientData.rule = rule
      }
    })
    socket.on(Events.On.accelerometerEvent, (rawData: IData) => {
      if (clientData.rule !== 'sender') {
        return
      }
      const packet = PacketFactory.generatePacketObject(rawData)
      if (this.checkPacketIsValid(packet, clientData) === false) {
        return
      }
      this.emitToReceiver(Events.Emit.accelerometerEvent, packet)
    })
    socket.on(Events.On.touchEvent, (rawData: IData) => {
      if (clientData.rule !== 'sender') {
        return
      }
      const packet = PacketFactory.generatePacketObject(rawData)
      if (this.checkPacketIsValid(packet, clientData) === false) {
        return
      }
      this.emitToReceiver(Events.Emit.touchEvent, packet)
    })
    socket.on(Events.On.geoLocation, (rawData: IData) => {
      if (clientData.rule !== 'sender') {
        return
      }
      const packet = PacketFactory.generatePacketObject(rawData)
      if (this.checkPacketIsValid(packet, clientData) === false) {
        return
      }
      this.emitToReceiver(Events.Emit.geoLocation, packet)
    })
    socket.on(Events.On.disconnect, (rawData: IData) => {
      clientData.lastSequenceNumber = -1
      if (clientData.rule === 'receiver') {
        this.receiverSocketId = null
        Logger.log('Receiver disconnected')
      } else {
        Logger.log('Sender disconnected')
      }
    })
  }
  private checkPacketIsValid(packet: IData, clientData: IClientData): boolean {
    if (packet.sequenceNumber <= clientData.lastSequenceNumber) {
      return false
    }
    if (packet.timeStamp > Date.now() + NetworkVariables.timeout) {
      return false
    }
    return true
  }
  private emitToReceiver(event: string, packet: IData) {
    if (this.receiverSocketId != null) {
      this.io.sockets.connected[this.receiverSocketId].emit(event, packet)
    }
  }
}
