const express = require('express');

class MockServer {
    constructor() {
        this.mockServerApp = express();
        this.mockServer = '';
        this.response = 'Hello';
        this.statusCode = 200;
        this.headers = [];
        this.serverSideHeaderCallback = null;
        this.default_get();
    }

    listen(port) {
        this.mockServer = this.mockServerApp.listen(port);
    }
    close() {
        this.mockServer.close();
    }
    get(path, callback) {
        this.mockServerApp.get(path, callback);
    }
    post(path, callback) {
        this.mockServerApp.post(path, callback);
    }
    setResponse(response) {
        this.response = response;
    }
    setStatusCode(status_code) {
        this.statusCode = status_code;
    }
    setHeader(header) {
        this.headers.push(header);
    }
    getServerSideHeaders(callback) {
        this.serverSideHeaderCallback = callback;
    }

    default_get() {
        this.get('/', (req, res) => {
            this.headers.forEach( (header) => {
                res.set(header);
            });

            if (this.serverSideHeaderCallback != null) {
                this.serverSideHeaderCallback(req.headers);
                this.serverSideHeaderCallback = null;
            }

            res.status(this.statusCode).send(this.response);
        });
    }
}

module.exports = {
    MockServer
}
