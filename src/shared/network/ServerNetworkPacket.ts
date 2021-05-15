import { NetworkEvent } from './NetworkData';
import { NetworkPacket } from './NetworkPacket';
export class ServerNetworkPacket implements NetworkPacket {
	serverTick: number;
	serverDeltaTime: number;
	events: NetworkEvent[] = [];
	constructor(serverTick: number, serverDeltaTime: number) {
		this.serverTick = serverTick;
		this.serverDeltaTime = serverDeltaTime;
	}
}
