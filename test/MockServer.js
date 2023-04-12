const express = require('express');

/*
    This is a Mock HTTP server for automated testing.
    The goal is to create a server where we can set the
    expected output, status code, headers, etc for a specific
    path.

    The Mock Server is built using express therefore
    it has the limitations of express. One "limitation" is
    that once we have set a handler for a specific path it will
    be giving that output until we instantiate other MockServer and
    set a different handler.
*/

class MockServer {
    constructor() {
        this.mockServerApp = express();
        this.server = null;
        this.serverSideHeaderCallback = null;
    }

    listen(callback = null) {
        //When port is zero the OS assigns an arbitrary unused port, this is good
        //for automated test
        this.server = this.mockServerApp.listen(0, callback);
    }
    getPort() {
        return (this.server !== null) ? this.server.address().port : null
    }
    close(callback) {
        if (this.server !== null) {
            this.server.close(callback)
        }
    }
    get(path, callback) {
        this.mockServerApp.get(path, callback);
    }
    post(path, callback) {
        this.mockServerApp.post(path, callback);
    }
    getServerSideHeaders(callback) {
        this.serverSideHeaderCallback = callback;
    }
}

module.exports = {
    MockServer
}
