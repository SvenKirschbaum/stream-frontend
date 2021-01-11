// noinspection NpmUsedModulesInstalled
const proxy = require('http-proxy-middleware');

console.log("TESTTESTTEST")

module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://localhost:8080' }));
    app.use(proxy('/api/sock/', { target: 'ws://localhost:8080', ws: true }));
};