import { NetworkID } from '../../server/NetworkID';
import { Vector2 } from './../Vector2';
import { NetworkData } from './NetworkData';
export class UpdatePlayerPositions_Data implements NetworkData {
	players: [NetworkID, Vector2][];
	constructor(players: [NetworkID, Vector2][]) {
		this.players = players;
	}
}
