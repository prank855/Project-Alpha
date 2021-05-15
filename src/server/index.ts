import { PlatformerGame_Server } from './PlatformerGame_Server';
import { Server } from './Server';
const server = new Server(new PlatformerGame_Server());
server.start();
