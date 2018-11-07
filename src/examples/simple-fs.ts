import * as SocketIOServer from 'socket.io';
import * as SocketIOClient from 'socket.io-client';
import * as http from 'http';
import * as fs from 'fs';

import { Api } from '../index';
import { SocketIOTransport } from '../socket.io.transport';

const PORT = 9090;
const httpBind = `http://localhost:${PORT}/`;

function exampleServer() {
    const srv = http.createServer();
    srv.listen(PORT);

    const server = SocketIOServer.default(srv);
    server.on('connection', socket => {
        console.log(`server: connection`);
        const transport = new SocketIOTransport(socket);

        // Provide RPC methods to SocketIO connection.
        new Api({
            selfMethods: {
                // `resolve` is remote callback!
                readFile: (path: string, resolve: (data: string) => void) => {
                    fs.readFile(path, 'utf8', (err, data) => {
                        if (err) return;
                        resolve(data);
                    });
                }
            }
        }, transport);
    });

    console.log('server ready');
}

function exampleClient() {
    const socket = SocketIOClient.connect(httpBind);

    setTimeout(async () => {
        const transport = new SocketIOTransport(socket);
        const api = new Api<{
            readFile: (path: string, resolve: (data: string) => void) => void,
        }, {}>({}, transport);

        api.callMethod('readFile', 'file.txt', (fileData: string) => {
            console.log('yeyy!', fileData);
        });
    }, 200);
}

exampleServer();
setTimeout(() => exampleClient(), 500);