import { NetworkID } from './../../server/NetworkID';
import { NetworkData } from './NetworkData';
export class AssignPlayerID_Data implements NetworkData {
	networkID: NetworkID;
	constructor(networkID: NetworkID) {
		this.networkID = networkID;
	}
}
