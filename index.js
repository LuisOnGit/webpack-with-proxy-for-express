const http = require('node:http');
const { http_proxy, https_proxy} = require('./proxy');

const PORT = 8080 || process.env.PORT;

const proxyServer = http.createServer();

proxyServer.listen(PORT, () => {
    console.log(`proxyServer started at ${PORT}`);
});

function log(clientRequest) {
    console.log(`Connected from ${clientRequest.socket.remoteAddress}`);
}

//HTTP requests
proxyServer.on('request', (clientRequest, clientResponse) => {
    log(clientRequest);
    http_proxy(clientRequest, clientResponse);
});

//HTTPS request are done through CONNECT method
proxyServer.on('connect', (clientRequest, clientSocket, head) => {
    log(clientRequest);
    https_proxy(clientRequest, clientSocket, head);
});

proxyServer.on('clientError', (error, socket) => {
    console.log('proxyServer::clientError');
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
