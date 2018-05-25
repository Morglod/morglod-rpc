# morglod-rpc

Simple OOP rpc with remote callback support.

## Example

Server:
```ts
const httpServer = http.createServer();
httpServer.listen(PORT);

const server = SocketIOServer(httpServer);
server.on('connection', socket => {
    const transport = new SocketIOTransport(socket);

    // Provide RPC methods to SocketIO connection.
    new Api({
        methods: {
            // `resolve` is remote callback!
            readFile: (path: string, resolve: (data: string) => void) => {
                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) return;
                    resolve(data);
                });
            })
        }
    }, transport);
});
```

Client:
```ts
const socket = SocketIO.connect(httpBind);
const transport = new SocketIOTransport(socket);
const api = new Api({ methods: {} }, transport);

api.callMethod('readFile', 'file.txt', (fileData: string) => {
    console.log('yeyy!', fileData);
});
```