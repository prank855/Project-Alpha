import { ClientNetworkPacket } from './../shared/network/ClientNetworkPacket';
import { ServerNetworkPacket } from './../shared/network/ServerNetworkPacket';
import { GameComponent } from './../shared/GameComponent';
export class ClientNetworkManager extends GameComponent {
	private ws: WebSocket | null = null;
	private isConnected: boolean = false;

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
			if (this.isConnected == true) {
				//do stuff
				for (var packet of this.incomingPackets) {
					//this.controller.processIncomingPacket(packet);
				}
				//this.controller.processOutgoingPacket(this.outgoingPacket);
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
	}
}
