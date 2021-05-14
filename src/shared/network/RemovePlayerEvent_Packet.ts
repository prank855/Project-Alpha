import { NetworkPacket } from './NetworkPacket';
import { RemovePlayerEvent_Data } from './RemovePlayerEvent_Data';
export class RemovePlayerEvent_Packet implements NetworkPacket {
	type = 'RemovePlayerEvent';
	data: RemovePlayerEvent_Data;
	constructor(data: RemovePlayerEvent_Data) {
		this.data = data;
	}
}
