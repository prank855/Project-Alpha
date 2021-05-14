import { Vector2 } from './../Vector2';
import { NetworkID } from './../../server/NetworkID';
import { NetworkData } from './NetworkData';

export class AddPlayerEvent_Data implements NetworkData {
	networkID: NetworkID;
	position: Vector2;
	constructor(networkID: NetworkID, position: Vector2) {
		this.networkID = networkID;
		this.position = position;
	}
}
