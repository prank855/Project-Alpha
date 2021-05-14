import { NetworkData } from './NetworkData';
export class ServerInfo_Data implements NetworkData {
	tickrate: number;
	tick: number;
	elapsedTime: number;
	deltaTime: number;
	constructor(
		tickrate: number,
		tick: number,
		elapsedTime: number,
		deltaTime: number
	) {
		this.tickrate = tickrate;
		this.tick = tick;
		this.elapsedTime = elapsedTime;
		this.deltaTime = deltaTime;
	}
}
