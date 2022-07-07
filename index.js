const http = require('node:http');
const { http_proxy, https_proxy} = require('./proxy');

const PORT = 8080 || process.env.PORT;

const proxyServer = http.createServer();

proxyServer.listen(PORT, () => {
    console.log(`proxyServer started at ${PORT}`);
});

//HTTP requests
proxyServer.on('request', (clientRequest, clientResponse) => {
    http_proxy(clientRequest, clientResponse);
});

//HTTPS request are done through CONNECT method
proxyServer.on('connect', (clientRequest, clientSocket, head) => {
    https_proxy(clientRequest, clientSocket, head);
});

proxyServer.on('clientError', (error, socket) => {
    console.log('proxyServer::clientError');
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});