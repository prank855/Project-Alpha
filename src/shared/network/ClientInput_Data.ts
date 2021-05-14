import { InputAction } from './../InputAction';
import { NetworkData } from './NetworkData';
export class ClientInput_Data implements NetworkData {
	inputs: InputAction[];
	constructor(inputs: InputAction[]) {
		this.inputs = inputs;
	}
}
