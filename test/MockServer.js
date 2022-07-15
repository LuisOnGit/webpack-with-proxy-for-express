const express = require('express');

class MockServer {
    constructor() {
        this.mockServerApp = express();
        this.mockServer = '';
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
}

module.exports = {
    MockServer
}
