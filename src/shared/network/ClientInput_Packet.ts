import { ClientInput_Data } from './ClientInput_Data';
import { NetworkPacket } from './NetworkPacket';
export class ClientInput_Packet implements NetworkPacket {
	type = 'ClientInput';
	data: ClientInput_Data;
	constructor(data: ClientInput_Data) {
		this.data = data;
	}
}
