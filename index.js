const env = {
	port: process.env.PORT || 80,
	gaTrackingID: process.env.GA_TRACKING_ID || ''
};

const App = require('./js/app');

const app = new App.App();
app.start(env);
