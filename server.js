var express = require('express');
var { createProxyMiddleware } = require('http-proxy-middleware');
var app = express();

// Middleware for authentication check
app.use(function (req, res, next) {
  var auth = req.header('Authorization');
  if (!auth || auth !== 'Basic 123') {
    // THIS IS WHERE YOU INSERT LOGIC
    // res.redirect(`https://login.mycompany.com?redirectUrl=localhost:4300`);
    // return;
  }
  next();
});


// Proxy configuration
app.use('/api', createProxyMiddleware({
  target: 'https://api.mycompany.com',
  changeOrigin: true,
  secure: false
}));

app.use('/', createProxyMiddleware({
  target: 'http://localhost:4200',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
}));

app.listen(4300);

