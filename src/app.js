const http = require('node:http');
const { http_proxy, https_proxy} = require('./proxy');

const proxyServer = http.createServer();

function log(clientRequest) {
    const headers = JSON.stringify(clientRequest.headers);
    const httpVersion = clientRequest.httpVersion;
    const httpMethod = clientRequest.method;
    const remoteAddress = clientRequest.socket.remoteAddress;
    console.log(`[${remoteAddress}] HTTP ${httpVersion} ${httpMethod} ${clientRequest.url}`);
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

module.exports = {
    proxyServer
}
