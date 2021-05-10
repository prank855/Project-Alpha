export class NetworkPacket {
  event: NetworkEvents;
  data: any;
  constructor(event: NetworkEvents, data: any) {
    this.event = event;
    this.data = data;
  }
}
