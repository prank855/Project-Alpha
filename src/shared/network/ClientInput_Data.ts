import { NetworkID } from './../../server/NetworkID';
import { InputAction } from './../InputAction';
import { NetworkData } from './NetworkData';
export class ClientInput_Data implements NetworkData {
	inputs: InputAction[];
	networkID: NetworkID;
	constructor(inputs: InputAction[], networkID: NetworkID) {
		this.inputs = inputs;
		this.networkID = networkID;
	}
}
