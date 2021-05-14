import { NetworkPacket } from './network/NetworkPacket';
import { InputScript } from './InputScript';
import { NetworkID } from '../server/NetworkID';

export class Player {
	networkId: NetworkID = -1;
	inputScript: InputScript | null = null;
	private networkPacketQueue: NetworkPacket[] = [];
	constructor() {}

	addPacket(packet: NetworkPacket) {
		this.networkPacketQueue.push(packet);
	}
	sendPackets(ws: WebSocket): void {
		if (ws.CONNECTING || ws.CLOSING || ws.CLOSED) {
			return;
		}
		if (this.networkPacketQueue.length == 0) {
			return;
		}
		ws.send(JSON.stringify(this.networkPacketQueue));
	}
	clearPackets(): void {
		this.networkPacketQueue.length = 0;
	}
	getPacketAmount(): number {
		return this.networkPacketQueue.length;
	}
}
