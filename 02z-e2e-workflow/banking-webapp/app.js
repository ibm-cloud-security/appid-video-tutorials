const express = require('express'); // https://www.npmjs.com/package/express
const session = require('express-session'); // https://www.npmjs.com/package/express-session
const passport = require('passport'); // https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy; // https://www.npmjs.com/package/ibmcloud-appid
const request = require('request');

const app = express();
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({
    tenantId: "",
    clientId: "",
    secret: "",
    oauthServerUrl: "",
    redirectUri: "http://localhost:3000/appid/callback"
}));

// Handle Login
app.get('/appid/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: '/',
    forceLogin: true
}));

// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Handle logout
app.get('/appid/logout', function (req, res) {
    WebAppStrategy.logout(req);
    res.redirect('/');
});

// Make sure only requests from an authenticated browser session can reach /api
app.use('/api', (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
});

// The /api/user API used to retrieve name and balance of a currently logged in user
app.get('/api/user', (req, res) => {
    let accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;

    request({
        method: "GET",
        url: "http://localhost:3001/banking/api/v2/customer/balance",
        json: true,
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }, (error, backendResponse, backendResponseBody) => {
        let balance = "unknown";
        if (error || (backendResponse && backendResponse.statusCode == 401)) {
            console.error(error);
        } else {
            balance = backendResponseBody.balance
        }
        return res.send({
            user: {
                name: req.user.name,
                balance: balance
            }
        });

    });
});

// Serve static resources
app.use(express.static('./public'));

// Start server
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});