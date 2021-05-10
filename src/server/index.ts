import WebSocket from "ws";
import { Server } from "./Server";
var ws: WebSocket.Server = new WebSocket.Server({ port: 8080 });
const server = new Server(ws, 128);
server.start();
