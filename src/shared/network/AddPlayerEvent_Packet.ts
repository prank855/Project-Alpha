import { AddPlayerEvent_Data } from './AddPlayerEvent_Data';
import { NetworkPacket } from './NetworkPacket';
export class AddPlayerEvent_Packet implements NetworkPacket {
	type = 'AddPlayerEvent';
	data: AddPlayerEvent_Data;
	constructor(data: AddPlayerEvent_Data) {
		this.data = data;
	}
}
