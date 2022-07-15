const { proxyServer } = require('../src/app');

const axios = require('axios').default;

const PROXY_PORT       = 45667;

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
});

afterAll(() => {
    proxyServer.close();
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
