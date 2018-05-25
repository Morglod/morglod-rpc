import { ITransport } from './transport';
export declare type DefaultMethodMap = {
    [methodName: string]: Function;
};
export declare type ApiDefinition<MethodMap = DefaultMethodMap> = {
    methods: MethodMap & DefaultMethodMap;
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
export declare class Api<MethodMap = DefaultMethodMap> {
    constructor(definition: ApiDefinition<MethodMap>, transport: ITransport);
    private handleRemoteCall;
    call: (params: {
        method?: string | undefined;
        callback?: string | undefined;
        args: any[];
    }) => Promise<any>;
    callMethod: (method: string | keyof MethodMap, ...args: any[]) => Promise<any>;
    readonly definition: ApiDefinition<MethodMap>;
    readonly transport: ITransport;
    private readonly callbacks;
    private uuid;
}
