import { NetworkPacket } from './../shared/network/NetworkPacket';
import { NetworkID } from './NetworkID';
import WebSocket from 'ws';
export class ConnectedClientManager {
	private clients: [WebSocket, NetworkID][] = [];
	private packetQueue: NetworkPacket[] = [];
	addClient(ws: WebSocket): NetworkID {
		const crypto = require('crypto');
		//TODO: not secure :)
		var id = crypto.randomInt(0, 10000000);
		this.clients.push([ws, id]);
		return id;
	}
	getClient(networkID: NetworkID): WebSocket | null {
		for (var client of this.clients) {
			if (client[1] == networkID) {
				return client[0];
			}
		}
		return null;
	}
	addPacket(packet: NetworkPacket) {
		this.packetQueue.push(packet);
	}
	getPacketQueueLength(): number {
		return this.packetQueue.length;
	}
}
