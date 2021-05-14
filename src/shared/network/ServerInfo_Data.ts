import { NetworkData } from './NetworkData';
export class ServerInfo_Data implements NetworkData {
	tickrate: number;
	tick: number;
	elapsedTime: number;
	constructor(tickrate: number, tick: number, elapsedTime: number) {
		this.tickrate = tickrate;
		this.tick = tick;
		this.elapsedTime = elapsedTime;
	}
}
