import * as Types from './../utils/Types'

export class PacketFactory {
  public static generatePacketObject(info: any[]): Types.IData {
    PacketFactory.lastSequenceNumber++
    return {
      sequenceNumber: PacketFactory.lastSequenceNumber,
      timeStamp: Date.now(),
      info
    }
  }
  public static resetSequenceNumber(): void {
    PacketFactory.lastSequenceNumber = 0
  }
  private static lastSequenceNumber = 0
}
