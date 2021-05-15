import WebSocket from 'ws';
import { NetworkPacket } from './NetworkPacket';

export interface NetworkedGameServer {
	websocket: WebSocket.Server;
	incomingPacketQueue: NetworkPacket[];
	outgoingPacketQueue: NetworkPacket[];
	initializeWebSocket(): void;
}
