import { GameObject } from './../GameObject';

import { NetworkData } from './NetworkData';

export class WorldStateData implements NetworkData {
	tick: number;
	tickRate: number;
	objects: GameObject[];
	constructor(tickrate: number, tick: number, objects: GameObject[]) {
		this.tickRate = tickrate;
		this.tick = tick;
		this.objects = objects;
	}
}
