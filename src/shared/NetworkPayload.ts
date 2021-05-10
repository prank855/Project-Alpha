import { NetworkPacket } from "../shared/NetworkPacket";
export class NetworkPayload {
  private packets: NetworkPacket[] = [];
  addPacket(packet: NetworkPacket) {
    this.packets.push(packet);
  }
}
