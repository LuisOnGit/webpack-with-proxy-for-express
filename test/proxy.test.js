const { proxyServer } = require('../src/app');
const { MockServer } = require('./MockServer');

const axios = require('axios').default;

const mockServer = new MockServer();

const PROXY_PORT       = 45667;
const MOCK_SERVER_PORT = PROXY_PORT - 1;

async function request_through_proxy(url = `http://localhost:${MOCK_SERVER_PORT}`) {
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

test('GET / MockServer', async () => {
    const mock_response = 'Hello';
    const mock_status_code = 200;
    mockServer.setResponse(mock_response);
    mockServer.setStatusCode(mock_status_code);

    const response = await request_through_proxy();
    expect(response.status).toBe(mock_status_code);
    expect(response.data).toBe(mock_response);
});

test('GET / MockServer, check headers', async () => {
    const response_text = 'Hello world';
    const header = {'name': 'myproxy'};
    mockServer.setResponse(response_text);
    mockServer.setHeader(header);

    const response = await request_through_proxy();
    expect(response.headers).toHaveProperty('x-powered-by', 'Express');
    expect(response.headers).toHaveProperty('content-type', 'text/html; charset=utf-8');
    expect(response.headers).toHaveProperty('content-length', response_text.length.toString());
    expect(response.headers).toHaveProperty('name', 'myproxy');
});
