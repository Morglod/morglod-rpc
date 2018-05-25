import 'socket.io-client';

import { DEBUG } from './config';
import { ITransport, ITransportRequestHandler, ITransportData, TransportEventName } from './transport';

export type SocketIOTransportProtocol = {
    uuid: number,
    data: ITransportData,
};

export type SocketIOTransportProtocolHandler = (response: SocketIOTransportProtocol) => void;

export type SocketIOSocket = {
    on(eventName: string, handler: (data: any) => void): void;
    emit(eventName: string, data: any): void;
};

export class SocketIOTransport implements ITransport {
    constructor(socket: SocketIOSocket) {
        this.socket = socket;
        socket.on(this.eventName, async (response: SocketIOTransportProtocol) => {
            if (DEBUG) console.log('SocketIOTransport: onData', JSON.stringify(response, null, 2));
            if (this.pending[response.uuid]) {
                if (DEBUG) console.log('SocketIOTransport: found pending', response.uuid);
                this.pending[response.uuid](response);
            } else {
                if (DEBUG) console.log('SocketIOTransport: forEach requestHandler');
                const resp = await this.requestHandler(response.data);
                this.socket.emit(this.eventName, {
                    uuid: response.uuid,
                    data: resp,
                });
            }
        });
    }

    request(data: ITransportData): Promise<ITransportData> {
        const req: SocketIOTransportProtocol = {
            uuid: ++this.uuid,
            data,
        };
        return new Promise(resolve => {
            this.pending[req.uuid] = (response) => {
                delete this.pending[req.uuid];
                resolve(response.data);
            };
            this.socket.emit(this.eventName, req);
        });
    }

    setRequestHandler(handler: ITransportRequestHandler): void {
        this.requestHandler = handler;
    }

    private requestHandler!: ITransportRequestHandler;
    readonly socket: SocketIOSocket;
    readonly eventName = TransportEventName;

    private readonly pending: { [key: string]: SocketIOTransportProtocolHandler } = {};
    private uuid: number = 0;
}