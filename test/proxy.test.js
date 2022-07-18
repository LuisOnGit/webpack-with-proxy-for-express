const { proxyServer } = require('../src/app');
const { MockServer } = require('./MockServer');

const axios = require('axios').default;

const mockServer = new MockServer();

const PROXY_PORT       = 45667;
const MOCK_SERVER_PORT = PROXY_PORT - 1;

async function get_request_through_proxy(url = `http://localhost:${MOCK_SERVER_PORT}`) {
    return await axios.get(url, { proxy: 
        {
            proxy: 'http',
            host: 'localhost',
            port: PROXY_PORT,
        }
    });
}

async function post_request_through_proxy(url = `http://localhost:${MOCK_SERVER_PORT}`) {
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

    const response = await get_request_through_proxy();
    expect(response.status).toBe(mock_status_code);
    expect(response.data).toBe(mock_response);
});

test('GET / MockServer, check headers', async () => {
    const response_text = 'Hello world';
    const header = {'name': 'myproxy'};
    mockServer.setResponse(response_text);
    mockServer.setHeader(header);

    const response = await get_request_through_proxy();
    expect(response.headers).toHaveProperty('x-powered-by', 'Express');
    expect(response.headers).toHaveProperty('content-type', 'text/html; charset=utf-8');
    expect(response.headers).toHaveProperty('content-length', response_text.length.toString());
    expect(response.headers).toHaveProperty('name', 'myproxy');
});

test('GET / MockServer, check if the header x-forwarded-for header in server side ', 
    async () => {
        mockServer.getServerSideHeaders((serverHeaders) => {
            expect(serverHeaders).toHaveProperty('x-forwarded-for', '::1');
        });
        const response = await get_request_through_proxy();
});

test('POST / MockServer', async () => {
    const mock_response = 'Post response';
    const mock_status_code = 200;
    mockServer.setResponse(mock_response);
    mockServer.setStatusCode(mock_status_code);

    const response = await post_request_through_proxy();
    expect(response.status).toBe(mock_status_code);
    expect(response.data).toBe(mock_response);
});

test('POST / MockServer, check headers', async () => {
    const response_text = 'Hello world';
    const header = {'name': 'myproxy'};
    mockServer.setResponse(response_text);
    mockServer.setHeader(header);

    const response = await post_request_through_proxy();
    expect(response.headers).toHaveProperty('x-powered-by', 'Express');
    expect(response.headers).toHaveProperty('content-type', 'text/html; charset=utf-8');
    expect(response.headers).toHaveProperty('content-length', response_text.length.toString());
    expect(response.headers).toHaveProperty('name', 'myproxy');
});

test('POST / MockServer, check if the header x-forwarded-for header in server side',
    async () => {
        mockServer.getServerSideHeaders((serverHeaders) => {
            expect(serverHeaders).toHaveProperty('x-forwarded-for', '::1');
        });
        const response = await post_request_through_proxy();
        expect(response.status).toBe(200);
});
