export declare type ITransportData = any;
export declare type ITransportRequestHandler = (data: ITransportData) => Promise<ITransportData>;
export interface ITransport {
    request(data: ITransportData): Promise<ITransportData>;
    setRequestHandler(handler: ITransportRequestHandler): void;
}
export declare const TransportEventName: string;
