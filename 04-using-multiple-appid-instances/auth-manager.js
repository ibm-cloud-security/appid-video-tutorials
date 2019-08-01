const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const authConfig = require('./auth-config');

function addAuthenticationRoutes(app){
	passport.serializeUser(function(user, cb) {cb(null, user);});
	passport.deserializeUser(function(obj, cb) {cb(null, obj);});
	app.use(passport.initialize());
	app.use(passport.session());

	let frontendConfig = [];

	Object.keys(authConfig).forEach(key => {
		let config = authConfig[key];
		let loginPath = "/appid/login_" + key;
		let callbackPath = "/appid/callback_" + key;
		config.redirectUri = "http://localhost:3000" + callbackPath;
		let strategy = new WebAppStrategy(config);
		strategy.name += key;
		passport.use(strategy);
		app.get(loginPath, passport.authenticate(strategy.name, { forceLogin: true, successRedirect: '/' }));	
		app.get(callbackPath, passport.authenticate(strategy.name));
		frontendConfig.push({
			displayName: config.displayName,
			loginPath: loginPath
		});
	});

	app.get("/appid/frontendconfig", (req, res, next)=>{
		return res.json(frontendConfig);
	});
	
	app.get("/appid/logout", (req, res, next) => {
		WebAppStrategy.logout(req);
		res.redirect('/');
	});
}

module.exports = {
	addAuthenticationRoutes: addAuthenticationRoutes
};