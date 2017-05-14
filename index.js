var env = {
    'port': process.env.PORT || 80,
    'hostname': process.env.HOSTNAME || '',
    'portHttps': process.env.PORT_HTTPS || 443,
    'hostnameHttps': process.env.HOSTNAME_HTTPS || '',
    'certDir': process.env.CERT_DIR || (__dirname + '/cert'),
    'gaTrackingID': process.env.GA_TRACKING_ID || '',
};

var App = require("./js/app");
var app = new App.App();
app.start(env);