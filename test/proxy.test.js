const { proxyServer } = require('../src/app');
const { MockServer } = require('./MockServer');
const axios = require('axios').default;

const PROXY_PORT = 45667;

async function get_request_through_proxy(path, mockserver) {
    const MOCK_SERVER_PORT = mockserver.getPort()
    const URL = `http://localhost:${MOCK_SERVER_PORT}${path}`
    return await axios.get(URL, { proxy: 
        {
            proxy: 'http',
            host: 'localhost',
            port: PROXY_PORT,
        }
    });
}

async function post_request_through_proxy(path, mockserver) {
    const MOCK_SERVER_PORT = mockserver.getPort()
    const URL = `http://localhost:${MOCK_SERVER_PORT}${path}`
    return await axios.post(URL, { proxy:
        {
            proxy: 'http',
            host: 'localhost',
            port: PROXY_PORT,
        }
    });
}

beforeAll(() => {
    proxyServer.listen(PROXY_PORT);
});
afterAll(() => {
    proxyServer.close()
});

/*
    Instantiate a new MockServer for each test.
    This is the easiest way to set a different
    handler for the same path in every test
*/
beforeEach( () => {
    this.mockserver = new MockServer()
    this.mockserver.listen();
})
afterEach( (done) => {
    this.mockserver.close( () => done() );
})

test('GET / MockServer', async () => {
    this.mockserver.get("/", (req, res) => {
        (req)
        res.status(200)
        res.send('Hello')
    })

    const response = await get_request_through_proxy("/", this.mockserver);
    expect(response.status).toBe(200);
    expect(response.data).toBe('Hello');
});

test('GET / MockServer, check headers', async () => {
    this.mockserver.get("/", (req, res) => {
        (req)
        res.status(200)
        res.set({'name': 'myproxy'})
        res.send('Hello world')
    })

    const response = await get_request_through_proxy("/", this.mockserver);
    expect(response.headers).toHaveProperty('x-powered-by', 'Express');
    expect(response.headers).toHaveProperty('content-type', 'text/html; charset=utf-8');
    expect(response.headers).toHaveProperty('content-length', 'Hello world'.length.toString());
    expect(response.headers).toHaveProperty('name', 'myproxy');
});

test('GET / MockServer, check if the header x-forwarded-for header in server side ', 
    async () => {
        this.mockserver.get("/", (req, res) => {
            (req)
            res.end()
        })

        this.mockserver.getServerSideHeaders((serverHeaders) => {
            expect(serverHeaders).toHaveProperty('x-forwarded-for', '::1');
        });
        const response = await get_request_through_proxy("/", this.mockserver);
});

test('POST / MockServer', async () => {
    this.mockserver.post("/", (req, res) => {
        (req)
        res.status(200)
        res.send('Post response')
    })

    const response = await post_request_through_proxy("/", this.mockserver);
    expect(response.status).toBe(200);
    expect(response.data).toBe('Post response');
});

test('POST / MockServer, check headers', async () => {
    this.mockserver.post("/", (req, res) => {
        (req)
        res.status(200)
        res.set({'name': 'myproxy'})
        res.send('Hello world')
    })

    const response = await post_request_through_proxy("/", this.mockserver);
    expect(response.headers).toHaveProperty('x-powered-by', 'Express');
    expect(response.headers).toHaveProperty('content-type', 'text/html; charset=utf-8');
    expect(response.headers).toHaveProperty('content-length', 'Hello world'.length.toString());
    expect(response.headers).toHaveProperty('name', 'myproxy');
});

test('POST / MockServer, check if the header x-forwarded-for header in server side',
    async () => {

        this.mockserver.post("/", (req, res) => {
            (req)
            res.end()
        })

        this.mockserver.getServerSideHeaders((serverHeaders) => {
            expect(serverHeaders).toHaveProperty('x-forwarded-for', '::1');
        });
        const response = await post_request_through_proxy("/", this.mockserver);
        expect(response.status).toBe(200);
});
