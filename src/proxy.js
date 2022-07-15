const http = require('node:http');
const https = require('node:https');
const net = require('node:net');
const { URL } = require('node:url');

function append_x_forwarded_for_header(clientRequest) {
    clientRequest.headers['X-Forwarded-For'] = clientRequest
                                                .socket
                                                .remoteAddress;
}

function removePortFromURL(host) {
    return host.substring(0, host.indexOf(':'));
}

function get_options(clientRequest) {
    const clientRequestURL = new URL(clientRequest.url);
    return {
        host: removePortFromURL(clientRequestURL.host),
        port: clientRequestURL.port,
        path: clientRequestURL.pathname,
        auth: clientRequestURL.auth,
        method: clientRequestURL.method,
        headers: clientRequestURL.headers
    }
}

function http_proxy(clientRequest, clientResponse) {
    append_x_forwarded_for_header(clientRequest);
    const options = get_options(clientRequest);
    const proxyRequest = http.request(options, (proxyResponse) => {
        clientResponse.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(clientResponse, {end: true});
    });
    proxyRequest.end();
    function end_proxy_request(error) {
        proxyRequest.end()
    }
    proxyRequest.on('error', end_proxy_request);
    proxyRequest.on('close', end_proxy_request);
    clientRequest.on('close', end_proxy_request);
    clientRequest.on('error', end_proxy_request);
}

function https_proxy(clientRequest, clientSocket, head) {
    append_x_forwarded_for_header(clientRequest);
    const { port, hostname } = new URL(`http://${clientRequest.url}`);

    const proxyRequest = net.connect(port, hostname, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node.js-Proxy\r\n' +
            '\r\n');
        //send the client headers
        proxyRequest.write(head);
        //pipe connection between parties
        proxyRequest.pipe(clientSocket, {end: true});
        clientSocket.pipe(proxyRequest, {end: true});

        function end_proxy_request(error) {
            proxyRequest.end()
        }
        //handle error or connection close
        proxyRequest.on('error', end_proxy_request);
        proxyRequest.on('close', end_proxy_request);
        clientRequest.on('error', end_proxy_request);
        clientRequest.on('close', end_proxy_request);
        clientSocket.on('error', end_proxy_request);
    });
}

module.exports = {
    http_proxy,
    https_proxy
}
