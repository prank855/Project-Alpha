import { Client } from './Client';

window.onload = () => {
	const ws = new WebSocket('ws://joshh.moe:8080');
	const GAME: Client = new Client(ws, 'Project Alpha');
	GAME.start();
};
