import { NetworkedGameServer } from './../shared/network/NetworkedGameServer';
import { Game } from '../shared/Game';
import WebSocket from 'ws';
export class PlatformerGame_Server extends Game implements NetworkedGameServer {
	frameRate = 128;
	gameName = 'Platformer Game';

	websocket = new WebSocket.Server({ port: 8080 });
	incomingPacketQueue = [];
	outgoingPacketQueue = [];

	constructor() {
		super();
		this.initializeWebSocket();
	}

	initializeWebSocket() {}

	setup() {}

	start() {}

	update() {
		this.currentScene.update();
	}
}
