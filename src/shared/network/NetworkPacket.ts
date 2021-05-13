import { NetworkData } from './NetworkData';

export interface NetworkPacket {
	type: string;
	data: NetworkData;
}
