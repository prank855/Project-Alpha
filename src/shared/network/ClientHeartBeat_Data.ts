import { NetworkID } from './../../server/NetworkID';
export class ClientHeartBeat_Data {
	networkID: NetworkID;
	constructor(networkID: NetworkID) {
		this.networkID = networkID;
	}
}
