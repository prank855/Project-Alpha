import { NetworkEvent } from './NetworkData';
import { NetworkPacket } from './NetworkPacket';

export class ClientNetworkPacket implements NetworkPacket {
	clientDelta: number;
	clientServerTick: number;
	events: NetworkEvent[] = [];
	constructor(clientDelta: number, clientServerTick: number) {
		this.clientDelta = clientDelta;
		this.clientServerTick = clientServerTick;
	}
}
