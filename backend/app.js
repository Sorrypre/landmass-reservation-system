const { setServers } = require('dns');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
/* https://www.npmjs.com/package/connect-mongo */
const { MongoStore } = require('connect-mongo');
const handlebars = require('express-handlebars');
const path = require('path');
const dns = require('dns');
const hbs = require('./hbs');
const db = require('./db');
const sess = require('./session');
require('dotenv').config({ quiet: true });
setServers(['8.8.8.8', '8.8.4.4']);

const port = process.env.PORT;
const root_dir = path.join(__dirname, '..');

let db_instance;

const xj = express();
xj.use(express.urlencoded({ extended: true }));
xj.use(express.json());
xj.use(express.static(root_dir));
/* https://expressjs.com/en/resources/middleware/session.html */
xj.use(session({
	secret: process.env.SESSION_SIGNATURE,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: process.env.MDB_URI_SRV,
		collectionName: 'session-store',
		ttl: 60 * 60 * 24 * 30,
		autoRemove: 'interval',
		autoRemoveInterval: 5,
	}),
	cookie: {
		sameSite: true,
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 30,
	},
}));
xj.engine('handlebars', handlebars.engine());
xj.set('view engine', 'handlebars');
xj.set('views', './frontend/pages');

xj.use(function(q, r, s) {
	if (q.url === '/testview')
		return s();
	/* lahat ng pages babalik sa login page pag walang session */
	if (q.method === 'GET' && q.url !== '/' && !q.session.email)
		return r.redirect('/');
	s();
});

/* GET */
xj.get('/', async function(q, r) {
	/*
	const rand = Math.floor(Math.random() * 10000);
	const hash = await sess.h512('password' + rand, undefined);
	const email = 'example.user' + rand + '@gmail.com';
	await db.register(email, hash.hashed, hash.salt);
	*/
	if (!q.session.email) {
		const template = await hbs.getTemplate('login', q.session.email);
		r.render('login', template);
	} else {
		r.redirect('/dashboard');
	}
});

xj.get('/login', function(q, r) {
	r.redirect('/');
})

xj.get('/dashboard', async function(q, r) {
	const template = await hbs.getTemplate('dashboard', q.session.email);
	r.render('dashboard', template);
});

xj.get('/reservation-list', async function(q, r) {
	const template = await hbs.getTemplate('reservation-list', q.session.email);
	r.render('reservation-list', template);
});

/* QUERY POST/GET */

xj.get('/query-current-user', async function(q, r) {
	if (!q.session.email) {
		return r.status(400).json({
			success: false,
			error: 'No user existing on session right now.',
		});
	}
	const result = await db.getUser(q.session.email, {});
	r.status(200).json({
		success: true,
		user: JSON.stringify(result),
	});
});

xj.get('/query-get-reservations', async function(q, r) {
	try {
		const reservations = await db.getReservations(q.session.email);
		r.status(200).json({
			success: true,
			reservations: reservations,
		});
	} catch (e) {
		r.status(500).json({
			success: false,
			error: e.message,
		});
	}
});

xj.post('/query-get-user', async function(q, r) {
	const result = await db.getUser(q.body.email, {});
	if (result !== null) {
		r.status(200).json({
			success: true,
			user: JSON.stringify(result),
		});
	} else {
		r.status(404).json({
			success: false,
			message: 'User not found.',
		});
	}
});

xj.post('/query-get-users', async function(q, r) {
	const result = await db.getUsers(q.body.email, q.body.matchjson).toArray(
		function(e, f) {
			if (e) {
				r.status(500).json({
					success: false,
					message: e.message,
				});
			} else {
				r.status(200).json({
					success: true,
					users: f,
				});
			}
		}
	);
});

xj.post('/query-modify-user', async function(q, r) {
	const try_user = await db.getUser(q.body.email, {});
	if (try_user === null) {
		return r.status(404).json({
			success: false,
			error: 'Trying to modify a non-existent user.',
		});
	}
	const result = await db.modifyUser(
		q.body.email,
		q.body.matchjson,
		q.body.setjson,
		q.body.deljson
	);
	r.status(200).json({
		success: true,
		modifiedCount: result,
	});
});

/*
xj.get('/testview', async function(q,r) {
	const template = await hbs.getTemplate('reservation-list', q.session.email);
	r.render('reservation-list', template);
});
*/

/* LOGIN/REGISTER POST */

xj.post('/lu', async function(q, r) {
	const eml = q.body.email;
	const pwd = q.body.password;
	if (!eml || !pwd) {
		return r.status(400).json({
			success: false,
			error: 'Invalid request.',
		});
	}
	const login = await db.login(eml, pwd);
	if (login === 1) {
		q.session.email = eml;
		r.status(200).json({
			success: true,
			message: 'Login successful.',
		});
	} else if (login === 0) {
		r.status(401).json({
			success: false,
			error: 'Invalid username or password.',
		});
	} else {
		r.status(404).json({
			success: false,
			error: 'User does not exist.',
		});
	}
});

xj.post('/lou', function(q, r, s) {
	q.session.destroy(function(e) {
		if (e) {
			return s(e);
		} else {
			r.clearCookie('connect.sid');
			r.status(200).json({
				success: true,
			});
		}
	});
});

xj.post('/ru', async function(q, r) {
	const eml = q.body.email;
	const pwd = q.body.password;
	if (!eml || !pwd) {
		return r.status(400).json({
			success: false,
			error: 'Invalid request.',
		});
	}
	const try_user = await db.getUser(q.body.email, {});
	if (try_user !== null) {
		return r.status(409).json({
			success: false,
			error: 'User already exists.',
		});
	}
	const hash = await sess.h512(pwd, undefined);
	const register = await db.register(q.body.email, hash.hashed, hash.salt);
	if (register) {
		r.status(200).json({
			success: true,
			message: 'Registration successful.',
		});
	} else {
		r.status(500).json({
			success: false,
			error: 'Unexpected error upon registering user.',
		});
	}
});

db.connect().then(function(msg) {
	console.log(msg);
	xj.listen(port, function() {
		console.log('server is now on listen @ port ' + port);
	});
}).catch(function(e) {
	console.error('unable to reach mongodb cluster | ' + e.message);
	process.exit(1);
});
