import { InputAction } from '../InputAction';
import { NetworkData } from './NetworkData';

export class ClientInputStateData implements NetworkData {
	inputs: InputAction[];
	constructor(inputs?: InputAction[]) {
		this.inputs = inputs || [];
	}
}
