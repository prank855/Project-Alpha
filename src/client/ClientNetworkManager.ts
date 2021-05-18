import { ClientNetworkPacket } from './../shared/network/ClientNetworkPacket';
import { ServerNetworkPacket } from './../shared/network/ServerNetworkPacket';
import { GameComponent } from './../shared/GameComponent';
export class ClientNetworkManager extends GameComponent {
	private ws: WebSocket | null = null;
	isConnected: boolean = false;

	private incomingPackets: ServerNetworkPacket[] = [];
	private outgoingPacket: ClientNetworkPacket | null = null;

	constructor() {
		super('ClientNetworkManager');
	}

	start() {
		this.connect(this.serverAddress);
	}

	update() {
		if (this.ws) {
			if (this.isConnected) {
				//do stuff
				for (var packet of this.incomingPackets) {
					//this.controller.processIncomingPacket(packet);
				}
				//this.controller.processOutgoingPacket(this.outgoingPacket);
				this.ws.send(JSON.stringify(this.outgoingPacket));
			}
		}
	}

	serverAddress: string = '';
	private connect(url: string) {
		this.serverAddress = url;
		this.ws = new WebSocket(url);
		this.ws.onopen = () => {
			this.isConnected = true;
			console.warn(`Connected to: ${this.serverAddress}`);
		};
		this.ws.onclose = () => {
			this.isConnected = false;
			console.warn(`Disconnected from: ${this.serverAddress}`);
			//TODO: retry connected after x seconds
		};
		this.ws.onmessage = msg => {
			var data = JSON.parse(msg.data) as ServerNetworkPacket;
			this.incomingPackets.push(data);
		};
	}
}
