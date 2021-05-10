import { Client } from './Client';
window.onload = () => {
	document.body.style.backgroundColor = '#222222';
	var client = new Client('Project Alpha');
	client.start();
};
