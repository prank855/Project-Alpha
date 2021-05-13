import { GameObject } from './GameObject';
import { NetworkData } from './NetworkData';

export class WorldStateData implements NetworkData {
	tick: number;
	objects: GameObject[];
	constructor(tick: number, objects: GameObject[]) {
		this.tick = tick;
		this.objects = objects;
	}
}
