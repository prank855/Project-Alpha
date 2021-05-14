import { InputAction } from './InputAction';
export interface InputScript {
	input(_inputs: InputAction[]): void;
}
