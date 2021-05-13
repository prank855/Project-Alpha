import { ClientInputStateData } from './ClientInputStateData';
import { NetworkPacket } from './NetworkPacket';
export class ClientInputState implements NetworkPacket {
	type = 'ClientInputState';
	data: ClientInputStateData;
	constructor(data: ClientInputStateData) {
		this.data = data;
	}
}
