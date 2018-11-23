import { ITransport } from './transport';
import * as tsargs from 'tsargs';
export declare type DefaultMethodMap = {
    [methodName: string]: (...args: any[]) => any;
};
export declare type ApiDefinition<RemoteMethodMap extends DefaultMethodMap, SelfMethodMap extends DefaultMethodMap> = {
    selfMethods?: SelfMethodMap;
};
export declare type ApiProtocolArg = {
    value?: any;
    callback?: string;
};
export declare type ApiProtocol = {
    method?: string;
    callback?: string;
    args: ApiProtocolArg[];
};
export declare class Api<RemoteMethodMap extends DefaultMethodMap, SelfMethodMap extends DefaultMethodMap> {
    constructor(definition: ApiDefinition<RemoteMethodMap, SelfMethodMap>, transport: ITransport);
    private handleRemoteCall;
    call: (params: {
        method?: string | undefined;
        callback?: string | undefined;
        args: any[];
    }) => Promise<any>;
    callMethod: <Method extends keyof RemoteMethodMap>(method: Method, ...args: tsargs.ArgsN<RemoteMethodMap[Method]>) => Promise<any>;
    readonly definition: ApiDefinition<RemoteMethodMap, SelfMethodMap>;
    readonly transport: ITransport;
    private readonly callbacks;
    private uuid;
}
