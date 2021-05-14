import { InputScript } from './InputScript';
import { NetworkID } from '../server/NetworkID';

export class Player {
	networkId: NetworkID = -1;
	inputScript: InputScript | null = null;
	constructor() {}
}
