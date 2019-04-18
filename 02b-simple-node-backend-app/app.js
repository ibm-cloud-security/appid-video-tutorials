const express = require('express'); 								// https://www.npmjs.com/package/express
const passport = require('passport');								// https://www.npmjs.com/package/passport
const APIStrategy = require('ibmcloud-appid').APIStrategy;			// https://www.npmjs.com/package/ibmcloud-appid

const app = express();
app.use(passport.initialize());
passport.use(new APIStrategy({
	oauthServerUrl: "",
}));

// Protect the whole app
app.use(passport.authenticate(APIStrategy.STRATEGY_NAME, {
	session: false
}));

// The /api/data API used to retrieve protected data
app.get('/api/data', (req, res) => {
	res.json({
		data: 12345
	});
});

// Start server
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});