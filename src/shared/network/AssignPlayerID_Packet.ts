import { AssignPlayerID_Data } from './AssignPlayerID_Data';
import { NetworkPacket } from './NetworkPacket';
export class AssignPlayerID_Packet implements NetworkPacket {
	type = 'AssignPlayerID';
	data: AssignPlayerID_Data;
	constructor(data: AssignPlayerID_Data) {
		this.data = data;
	}
}
