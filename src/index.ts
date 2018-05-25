import { DEBUG } from './config';
import { ITransport, ITransportRequestHandler } from './transport';

export type DefaultMethodMap = { [methodName: string]: Function };

export type ApiDefinition<MethodMap = DefaultMethodMap> = {
    // version: string,
    // minVersion?: string[],
    methods: MethodMap & DefaultMethodMap,
};

export type ApiProtocolArg = {
    value?: any,
    callback?: string,
};

export type ApiProtocol = {
    method?: string,
    callback?: string,
    args: ApiProtocolArg[]
};

export class Api<MethodMap = DefaultMethodMap> {
    constructor(definition: ApiDefinition<MethodMap>, transport: ITransport) {
        this.definition = definition;
        this.transport = transport;

        transport.setRequestHandler(this.handleRemoteCall);
    }

    private handleRemoteCall: ITransportRequestHandler = async (data: ApiProtocol) => {
        let func: Function;
        
        if (data.method) {
            if (!this.definition.methods[data.method]) {
                console.error(`method '${data.method}' not found`);
                return;
            }
            func = this.definition.methods[data.method];
        } else if (data.callback) {
            if (!this.callbacks[data.callback]) {
                console.error(`callback '${data.method}' not found`);
                return;
            }
            func = this.callbacks[data.callback];
        } else {
            console.error('not method & not callback');
            return;
        }

        const args = data.args.map(arg => {
            if (arg.callback) {
                return (...callbackArgs: any[]) => {
                    return this.call({
                        callback: arg.callback,
                        args: callbackArgs,
                    });
                };
            }
            return arg.value;
        });

        if (DEBUG) console.log('calling func');
        return func(...args);
    }

    call = async (params: {
        method?: string,
        callback?: string,
        args: any[]
    }) => {
        const apiProtocol: ApiProtocol = {
            method: params.method,
            callback: params.callback,
            args: params.args.map(arg => {
                if (typeof arg === 'function') {
                    const callbackUUID = `${++this.uuid}`;
                    this.callbacks[callbackUUID] = arg;
                    return { callback: callbackUUID };
                }
                return { value: arg };
            }),
        };

        return this.transport.request(apiProtocol);
    }

    callMethod = async (method: (keyof MethodMap)|string, ...args: any[]) => this.call({ method, args });

    readonly definition: ApiDefinition<MethodMap>;
    readonly transport: ITransport;

    private readonly callbacks: { [uuid: string]: Function } = {};
    private uuid: number = 0;
}