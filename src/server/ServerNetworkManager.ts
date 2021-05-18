import { ServerNetworkPacket } from './../shared/network/ServerNetworkPacket';
import { ClientNetworkPacket } from './../shared/network/ClientNetworkPacket';
import { GameComponent } from '../shared/GameComponent';
import WebSocket from 'ws';

export class ServerNetworkManager extends GameComponent {
	private wss: WebSocket.Server | null = null;
	private isHosted: boolean = false;

	private incomingPackets: ClientNetworkPacket[] = [];
	private outgoingPackets: ServerNetworkPacket[] = [];

	constructor() {
		super('ServerNetworkManager');
	}

	start() {}
	update() {
		if (this.isHosted) {
			//do stuff
			for (var packet of this.incomingPackets) {
				//this.controller.processIncomingPacket(packet);
			}
			//this.controller.processOutgoingPackets(this.outgoingPackets);
		}
	}
	host() {
		this.wss = new WebSocket.Server({ port: 8080 });
		this.isHosted = true;
		this.wss.on('connection', (e, r) => {
			console.log(`Connected Client : ${r.socket.remoteAddress?.substr(7)}`);
		});
		console.log('Server hosted');
	}
}
