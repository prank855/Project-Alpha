import { NetworkPacket } from './NetworkPacket';
import { ServerInfo_Data } from './ServerInfo_Data';
export class ServerInfo_Packet implements NetworkPacket {
	type = 'ServerInfo';
	data: ServerInfo_Data;
	constructor(data: ServerInfo_Data) {
		this.data = data;
	}
}
