import { Client } from './Client';

window.onload = () => {
	const GAME: Client = new Client('Project Alpha');
	GAME.start();
};
