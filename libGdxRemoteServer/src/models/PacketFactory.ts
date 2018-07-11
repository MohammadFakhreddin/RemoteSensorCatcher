import { CommonValidator } from '../utils/RegexValidator'
import { IData } from '../web_sockets/IWebSocket'

export class PacketFactory {
  public static generatePacketObject(rawData: IData): {
    sequenceNumber: number
    timeStamp: number,
    info: any[]
  } {
    return {
      sequenceNumber: (typeof rawData.sequenceNumber === 'number') ? Number(rawData.sequenceNumber) : null,
      timeStamp: (typeof rawData.timeStamp === 'number') ? Number(rawData.timeStamp) : null,
      info: (CommonValidator.isEmptyArray(rawData.info) === true) ? null : rawData.info
    }
  }
}
