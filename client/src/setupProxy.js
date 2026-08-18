const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const target = process.env.REACT_APP_API_BASE || 'http://localhost:2000';
    app.use(
        '/api',
        createProxyMiddleware({
            target: target,
            changeOrigin: true,
            secure: false
        })
    );
};
