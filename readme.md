# morglod-rpc

Simple OOP rpc with remote callback support.

!! Install by `--save-exact`, coz still in development.

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

Protocol:
```ts
type ApiDef = {
    readFile: (path: string, resolve: (data: string) => void) => void,
};
```

Client:
```ts
const socket = SocketIO.connect(httpBind);
const transport = new SocketIOTransport(socket);
const api = new Api<ApiDef, {}>({}, transport);

api.callMethod('readFile', 'file.txt', (fileData: string) => {
    console.log('yeyy!', fileData);
});
```

# TODO

Add middlewares and pre-call hooks