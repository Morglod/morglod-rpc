import * as SocketIOServer from 'socket.io';
import * as SocketIOClient from 'socket.io-client';
import * as http from 'http';

import { Api } from '../index';
import { SocketIOTransport } from '../socket.io.transport';

const PORT = 9090;
const httpBind = `http://localhost:${PORT}/`;

const exampleMethods = {
    /** take argumens and return value */
    sum: (a: number, b: number) => a + b,
    sub: (a: number, b: number) => a - b,
    print: (text: string) => console.log(text),

    /** callbacks */
    cbSum: (a: number, b: number, resolve: Function) => resolve(a + b)
};

function exampleServer() {
    const srv = http.createServer();
    srv.listen(PORT);

    const server = SocketIOServer.default(srv);
    server.on('connection', socket => {
        console.log(`server: connection`);
        const transport = new SocketIOTransport(socket);

        const exampleApi = new Api({
            selfMethods: exampleMethods
        }, transport);
    });

    console.log('server ready');
}

function exampleClient() {
    const socket = SocketIOClient.connect(httpBind);

    setTimeout(async () => {
        const transport = new SocketIOTransport(socket);
    
        const exampleApi = new Api<typeof exampleMethods, typeof exampleMethods>({
            selfMethods: exampleMethods
        }, transport);
    
        console.log('client ready');
    
        const sumResult = await exampleApi.callMethod('sum', 10, 20);
        console.log('sum result', sumResult);
    
        await exampleApi.callMethod('print', 'Hello world!');
        await exampleApi.callMethod('cbSum', 20, 20, (resultage: any) => {
            console.log('cb result', resultage)
        });
    }, 200);
}

exampleServer();
setTimeout(() => exampleClient(), 500);