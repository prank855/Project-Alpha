import { Player } from './../shared/Player';
import { GameManager } from './../shared/GameManager';
import WebSocket from 'ws';
import { AssignPlayerID_Data } from '../shared/network/AssignPlayerID_Data';
import { AssignPlayerID_Packet } from '../shared/network/AssignPlayerID_Packet';
import { NetworkPacket } from '../shared/network/NetworkPacket';
import { ServerInfo_Data } from '../shared/network/ServerInfo_Data';
import { ServerInfo_Packet } from '../shared/network/ServerInfo_Packet';
import { Time } from './Time';
export class ServerGameManager extends GameManager {
	ws: WebSocket.Server;

	tickRate: number = 128;
	tick: number = 0;

	players: Player[] = [];

	constructor() {
		super();
		this.ws = new WebSocket.Server({ port: 8080 });
		this.initializeSockets(this.ws);
	}
	initializeSockets(ws: WebSocket.Server) {
		ws.on('connection', (ws, req) => {
			var data: NetworkPacket[] = [];
			const crypto = require('crypto');
			var id = crypto.randomInt(0, 10000000);
			var player = new Player();
			this.players.push((player.networkId = id));
			data.push(
				new ServerInfo_Packet(
					new ServerInfo_Data(this.tickRate, this.tick, Time.elapsedTime)
				)
			);
			data.push(new AssignPlayerID_Packet(new AssignPlayerID_Data(id)));
			ws.send(JSON.stringify(data));
			console.log(`Created Client with ID:`, id);
			ws.onmessage = msg => {
				var temp = JSON.parse(msg.data.toString());
			};
		});
	}
	start() {
		this.objectManager.update();
	}
	update() {}
}
