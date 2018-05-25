import { VERSION } from './config';

export type ITransportData = any;
export type ITransportRequestHandler = (data: ITransportData) => Promise<ITransportData>;

export interface ITransport {
    request(data: ITransportData): Promise<ITransportData>;
    setRequestHandler(handler: ITransportRequestHandler): void;
}

export const TransportEventName = 'morglod-rpc-' + VERSION;