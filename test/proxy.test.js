const request = require('supertest');

const { proxyServer } = require('../src/app');

beforeAll(() => {
});

function printError(error, response) {
    if (error)
        console.log(error);
}

test('GET / google.com', () => {
    request(proxyServer)
            .get('/')
            .end(printError);
});
