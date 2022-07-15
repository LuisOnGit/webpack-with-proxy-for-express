const { proxyServer } = require('../src/app');
const { MockServer } = require('./MockServer');

const axios = require('axios').default;

const mockServer = new MockServer();

const PROXY_PORT       = 45667;
const MOCK_SERVER_PORT = PROXY_PORT - 1;

async function request_through_proxy(url) {
    return await axios.get(url, { proxy: 
        {
            proxy: 'http',
            host: 'localhost',
            port: PROXY_PORT,
        }
    });
}

beforeAll(() => {
    proxyServer.listen(PROXY_PORT);
    mockServer.listen(MOCK_SERVER_PORT);
});

afterAll(() => {
    proxyServer.close();
    mockServer.close();
});

/*
 * Needs internet connection in order to run the test
 * */
test('GET / http://google.com/', async () => {
    const response = await request_through_proxy(`http://google.com/`);
    expect(response.status).toBe(200);
});

/*
 * Needs internet connection in order to run the test
 * */
test('GET / https://google.com', async () => {
    const response = await request_through_proxy(`http://google.com/`);
    expect(response.status).toBe(200);
});

test('GET / MockServer', async () => {
    const mock_response = 'Hello';
    const mock_status_code = 200;
    mockServer.setResponse(mock_response);
    mockServer.setStatusCode(mock_status_code);

    const response = await request_through_proxy(`http://localhost:${MOCK_SERVER_PORT}`);
    expect(response.status).toBe(mock_status_code);
    expect(response.data).toBe(mock_response);
});
