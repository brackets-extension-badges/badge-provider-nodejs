var App = require("./js/app");
var app = new App.App();
// [port, 'hostname'] | [port, '']
app.start({http: [80, ''], https: [443, '']});