const PORT = process.env.PORT || 80;
const SSL_PORT = process.env.SSL_PORT || 443;

var App = require("./js/app");
var app = new App.App();
// [port, 'hostname'] | [port, '']
app.start({http: [PORT, ''], https: [SSL_PORT, '']});