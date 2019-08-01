const express = require('express'); 								// https://www.npmjs.com/package/express
const passport = require('passport');								// https://www.npmjs.com/package/passport
const APIStrategy = require('ibmcloud-appid').APIStrategy;			// https://www.npmjs.com/package/ibmcloud-appid

const app = express();
app.use(passport.initialize());
passport.use(new APIStrategy({
	oauthServerUrl: "",
}));

// Protect the whole  app
app.use(passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }));

// The /banking/api/v2/customer/balance API used to retrieve protected data
app.get('/banking/api/v2/customer/balance', (req, res) => {
	console.log("Retrieving user balance for customer ::", req.appIdAuthorizationContext.accessTokenPayload.sub);
	res.json({
		balance: "$12345.67"
	});
});

// Start server
app.listen(3001, () => {
    console.log('Listening on http://localhost:3001');
});