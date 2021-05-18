import { Time } from './../shared/Time';
import { ServerNetworkPacket } from './../shared/network/ServerNetworkPacket';
import { ClientNetworkPacket } from './../shared/network/ClientNetworkPacket';
import { GameComponent } from '../shared/GameComponent';
import WebSocket from 'ws';
import { json } from 'express';

export class ServerNetworkManager extends GameComponent {
	private wss: WebSocket.Server | null = null;
	private isHosted: boolean = false;

	private incomingPackets: ClientNetworkPacket[] = [];
	private outgoingPacket: ServerNetworkPacket | null = null;

	constructor() {
		super('ServerNetworkManager');
	}

	start() {}
	update() {
		if (this.isHosted && this.wss) {
			//do stuff
			for (var packet of this.incomingPackets) {
				//this.controller.processIncomingPacket(packet);
			}
			//this.controller.processOutgoingPackets(this.outgoingPackets);
			if (this.outgoingPacket) {
				this.wss?.emit(JSON.stringify(this.outgoingPacket));
			}
		}
	}
	host() {
		this.wss = new WebSocket.Server({ port: 8080 });
		this.isHosted = true;
		this.wss.on('connection', (ws, req) => {
			console.log(`Connected Client : ${req.socket.remoteAddress?.substr(7)}`);
			ws.onmessage = msg => {
				var data = JSON.parse(msg.data.toString()) as ClientNetworkPacket;
				this.incomingPackets.push(data);
			};
		});

		console.log('Server hosted');
	}
}
