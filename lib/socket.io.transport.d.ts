import 'socket.io-client';
import { ITransport, ITransportRequestHandler, ITransportData } from './transport';
export declare type SocketIOTransportProtocol = {
    uuid: number;
    data: ITransportData;
};
export declare type SocketIOTransportProtocolHandler = (response: SocketIOTransportProtocol) => void;
export declare type SocketIOSocket = {
    on(eventName: string, handler: (data: any) => void): void;
    emit(eventName: string, data: any): void;
};
export declare class SocketIOTransport implements ITransport {
    constructor(socket: SocketIOSocket);
    request(data: ITransportData): Promise<ITransportData>;
    setRequestHandler(handler: ITransportRequestHandler): void;
    private requestHandler;
    readonly socket: SocketIOSocket;
    eventName: string;
    private readonly pending;
    private uuid;
}
