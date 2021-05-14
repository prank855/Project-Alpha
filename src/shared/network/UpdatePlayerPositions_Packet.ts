import { UpdatePlayerPositions_Data } from './UpdatePlayerPositions_Data';
import { NetworkPacket } from './NetworkPacket';
export class UpdatePlayerPositions_Packet implements NetworkPacket {
	type = 'UpdatePlayerPositions';
	data: UpdatePlayerPositions_Data;
	constructor(data: UpdatePlayerPositions_Data) {
		this.data = data;
	}
}
