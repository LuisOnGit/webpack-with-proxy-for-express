const { MockServer } = require('./MockServer');
const axios = require('axios').default;

/*
    Since the port where the mock server port is arbtrary assigned by
    the OS, which is good because we need it that way for automated tests,
    we need to specify in every HTTP request the port where the mock server
    is listening.

    We could use a library like supertest that abstract the port binding for us,
    but, since this is a project for learning purposes I prefer to not use any dependency
    and do not hide the steps to use this MockServer
*/

function buildMockServerURI(path, mockserver) {
    const PORT = mockserver.getPort()
    return `http://localhost:${PORT}${path}`
}

async function get_request(path, mockserver) {
    return await axios.get(buildMockServerURI(path, mockserver))
}

async function post_request(path, mockserver) {
    return await axios.post(buildMockServerURI(path, mockserver))
}

beforeEach((done) => {
    this.mockserver = new MockServer()
    this.mockserver.listen(() => done() )
})

afterEach((done) => {
    this.mockserver.close( () => done() )
})

test("test get request at /", async () => {
    this.mockserver.get("/", (req, res) => {
        (req)
        res.status(200)
        res.set({'customheader': 'whatever'})
        res.send('hello')
    })

    const response = await get_request("/", this.mockserver)
    expect(response.status).toBe(200)
    expect(response.data).toBe('hello')
    expect(response.headers).toHaveProperty('customheader', 'whatever')
})

test("test get request at /somepath", async () => {
    this.mockserver.get("/somepath", (req, res) => {
        (req)
        res.status(200)
        res.set({'customheader': 'whatever'})
        res.send('hello')
    })

    const response = await get_request("/somepath", this.mockserver)
    expect(response.status).toBe(200)
    expect(response.data).toBe('hello')
    expect(response.headers).toHaveProperty('customheader', 'whatever')
})

test("test post request at /", async () => {
    this.mockserver.post("/", (req, res) => {
        (req)
        res.status(200)
        res.set({'customheader': 'whatever'})
        res.send('hello')
    })

    const response = await post_request("/", this.mockserver)
    expect(response.status).toBe(200)
    expect(response.data).toBe('hello')
    expect(response.headers).toHaveProperty('customheader', 'whatever')
})
