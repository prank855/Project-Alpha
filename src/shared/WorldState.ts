import { NetworkPacket } from './NetworkPacket';
import { WorldStateData } from './WorldStateData';

export class WorldState implements NetworkPacket {
	type = 'WorldState';
	data: WorldStateData;
	constructor(worldStateData: WorldStateData) {
		this.data = worldStateData;
	}
}
