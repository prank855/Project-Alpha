import { Client } from './Client';

window.onload = () => {
	console.log(
		'%cFind project at: https://github.com/prank855/Project-Alpha',
		'background: #222; color: #bada55'
	);
	const GAME: Client = new Client();
	GAME.start();
};
