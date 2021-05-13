import { NetworkPacket } from '../shared/network/NetworkPacket';

export class ServerManager {
	private incomingPacketQueue: NetworkPacket[] = [];
	private outgoingPacketQueue: NetworkPacket[] = [];

	addIncomingPacket(packet: NetworkPacket) {
		this.incomingPacketQueue.push(packet);
	}

	addOutgoingPacket(packet: NetworkPacket) {
		this.outgoingPacketQueue.push(packet);
	}

	processPackets() {
		for (var p of this.incomingPacketQueue) {
			//process
		}
	}

	sendPackets() {
		for (var p of this.outgoingPacketQueue) {
			//process
		}
	}
}
