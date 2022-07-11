const { proxyServer } = require('./app');

const PORT = 8080 || process.env.PORT;

proxyServer.listen(PORT, () => {
    console.log(`proxy server started at ${PORT}`);
});
