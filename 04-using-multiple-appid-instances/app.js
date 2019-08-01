const express = require('express');
const session = require('express-session');
const authManager = require('./auth-manager');
const app = express();

// Warning The default server-side session storage implementation, MemoryStore, 
// is purposely not designed for a production environment. It will 
// leak memory under most conditions, it does not scale past a single process, 
// and is meant for debugging and developing.
// For a list of stores, see compatible session stores below
// https://www.npmjs.com/package/express-session#compatible-session-stores
app.use(session({
  secret: "123456",
  resave: true,
  saveUninitialized: true,
	proxy: true,
	cookie: {
		httpOnly: true
	}
}));

authManager.addAuthenticationRoutes(app);

// Protect /api so it can only be invoked by authenticated users
app.use('/api', (req, res, next) => {
	if (req.user){
		return next();
	} else {
		return res.status(401).send('Unauthorized');
	}
});

app.get('/api/user', (req, res, next) => {
	res.send(req.user);
});

app.use(express.static("./public"));

app.listen(3000, function(){
  console.log("Listening on http://localhost:3000");
});

