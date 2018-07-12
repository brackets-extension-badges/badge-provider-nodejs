var env = {
    'port': process.env.PORT || 80,
    'gaTrackingID': process.env.GA_TRACKING_ID || ''
};

var App = require("./js/app");
var app = new App.App();
app.start(env);