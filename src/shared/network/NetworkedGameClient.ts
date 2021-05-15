import { NetworkPacket } from './NetworkPacket';
export interface NetworkedGameClient {
	websocket: WebSocket;
	incomingPacketQueue: NetworkPacket[];
	outgoingPacketQueue: NetworkPacket[];
	initializeWebSocket(): void;
}
