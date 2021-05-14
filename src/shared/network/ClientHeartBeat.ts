import { ClientHeartBeat_Data } from './ClientHeartBeat_Data';
import { NetworkPacket } from './NetworkPacket';
export class ClientHeartBeat_Packet implements NetworkPacket {
	type = 'ClientHeartBeat';
	data: ClientHeartBeat_Data;
	constructor(data: ClientHeartBeat_Data) {
		this.data = data;
	}
}
