import WebSocket from 'ws';
import { Server } from './Server';
let wss: WebSocket.Server = new WebSocket.Server({ port: 8080 });
const server = new Server(wss, 128);
server.start();
