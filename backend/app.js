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
const reserveSeatRouter = require('./routes/reserveSeatRoutes');
const port = process.env.PORT;
const root_dir = path.join(__dirname, '..');
const xj = express();
require('dotenv').config({ quiet: true });
setServers(['8.8.8.8', '8.8.4.4']);
xj.use(express.json({limit: '5mb'}));
xj.use(express.urlencoded({ limit: '5mb', extended: true }));
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
		maxAge: null,
	},
}));
xj.use(express.static(root_dir));
/* https://expressjs.com/en/resources/middleware/session.html */
xj.engine('handlebars', handlebars.engine({
	partialsDir: path.join(root_dir, '/frontend/pages/partials'),
	helpers: {
		or(left, right) {
			return left || right;
		},
		and(left, right) {
			return left && right;
		},
		und(operand) {
			return typeof operand === 'undefined';
		},
		undt(operand) {
			return operand === undefined || operand;
		},
		nmpt(array) {
			return Array.isArray(array) && array.length > 0;
		},
		mpt(array) {
			return Array.isArray(array) && array.length === 0;
		},
		ndx(n) {
			return n != null && Number.isInteger(n) && n >= 0;
		},
		equ(left, right) {
			return left === right;
		},
		neq(left, right) {
			return left !== right;
		},
		gtr(left, right) {
			return left > right;
		},
		jsonstr(json) {
			return JSON.stringify(json).replaceAll('"', '\\"');
		},
	},
}));
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
xj.use('/reserve-seat', reserveSeatRouter);

/* GET */

/*
xj.get('/testview', async function(q,r) {
	const template = await hbs.getTemplate('settings', q.session.email);
	r.render('settings', template);
});
*/

xj.get('/', async function(q, r) {
	/*db.dummyUsers(5);*/
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

xj.get('/buildings', async function(q, r) {
	const template = await hbs.getTemplate('buildings', q.session.email);
	r.render('buildings', template);
});

xj.get('/settings', async function(q,r) {
	const template = await hbs.getTemplate('settings', q.session.email);
	r.render('settings', template);
});

xj.get('/about', async function(q, r) {
	const template = await hbs.getTemplate('about', q.session.email);
	r.render('about', template);
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
		//Filtering Match Parameters
		const email = q.session.email;
		const building = q.query.building;
		const room = q.query.room;
		const startTime = q.query.startTime;
		const date = q.query.date;
		const username = q.query.username;

		const user = await db.getUser(email, {});
		const isLabTech = user && user.admin;

		let reservations = [];

		if (isLabTech) {
			reservations = await db.getAllReservations();
		} else {
			reservations = await db.getReservations(email);
		}

		reservations = reservations.filter(res => {
			const db_filter = db.applyFilters(res, building, room, startTime, date);

			//if username filter then check reservations if it includes the username
			const user_filter = username ?
				(res.requestor && res.requestor.toLowerCase().includes(username.toLowerCase())) : true;
			return db_filter && user_filter;
		});

		r.status(200).json({
			success: true,
			reservations: reservations
		});
	} catch (e) {
		r.status(500).json({
			success: false,
			error: e.message
		});
	}
});

xj.post('/query-remove-reservation', async function(q, r) {
	try {
		const session_email = q.session.email;
		const { reservation_id, user_email } = q.body;
		const email_query = user_email || session_email;

		const result = await db.removeReservation(email_query, reservation_id);

		if (result.modifiedCount > 0) {
			r.status(200).json({
				success: true,
				message: 'Reservation removed successfully.',
			});
		} else {
			r.status(404).json({
				success: false,
				error: 'Reservation not found.',
			});
		}
	}
	catch (e) {
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
	try {
		const result = await db.getUsers(q.body.matchjson);
		r.status(200).json({
			success: true,
			users: result,
		});
	} catch (e) {
		r.status(500).json({
			success: false,
			error: e.message,
		});
	}
});

xj.post('/query-modify-user', async function(q, r) {
	const try_user = await db.getUser(q.body.email, {});
	if (try_user === null) {
		return r.status(404).json({
			success: false,
			error: 'Trying to modify a non-existent user.',
		});
	}
	const result = await db.setUser(
		q.body.email,
		JSON.parse(q.body.matchjson),
		JSON.parse(q.body.updjson),
	);
	r.status(200).json({
		success: true,
		modifiedCount: result,
	});
});

xj.post('/query-change-password', async function(q, r) {
	const try_user = await db.getUser(q.body.email, {});
	if (try_user === null) {
		return r.status(404).json({
			success: false,
			error: 'Trying to modify a non-existent user.',
		});
	}
	const new_hashing = await sess.h512(q.body.password, try_user.salt);
	const result = await db.setUser(
		q.body.email,
		{},
		{ 'hash': new_hashing.hashed }
	);
	r.status(200).json({
		success: true,
		modifiedCount: result,
	});
});

xj.post('/make-dialog', async function(q, r) {
	try {
		const template = hbs.getDialogTemplate(q.body.dialogs);
		r.render('partials/dialogs', template, function(e, html) {
			if (e) {
				return r.status(500).json({
					success: false,
					error: e.message,
				});
			}
			return r.status(200).json({
				success: true,
				html: html,
			});
		});
	} catch (e) {
		return r.status(500).json({
			success: false,
			error: e.message,
		});
	}
});

xj.post('/query-edit-reservation', async function(q, r) {
	try {
		let { reservation_id, user_email, building, room, startTime, endTime, seat } = q.body;
		let email = user_email || q.session.email;

		const seat_conflict = await db.getUsers({
			"reservations": {
				$elemMatch: {
					"_id": { $ne: new mongoose.Types.ObjectId(reservation_id) },
					"details.startTime": { $lt: new Date(endTime) },
					"details.endTime": { $gt: new Date(startTime) },
					"details.room": room,
					"details.seat": Number(seat)
				}
			}
		});

		if (seat_conflict && seat_conflict.length > 0) {
			return r.status(409).json({
				success: false,
				error: 'Seat is already reserved for another user.',
			});
		}

		const update_reservation = {
			'reservations.$.details.building': building,
			'reservations.$.details.room': room,
			'reservations.$.details.startTime': new Date(startTime),
			'reservations.$.details.endTime': new Date(endTime),
			'reservations.$.details.seat': Number(seat),
			'reservations.$.dt_request': new Date(),
		};

		const success = await db.updateReservation(email, reservation_id, update_reservation);

		if (success) {
			r.status(200).json({
				success: true,
				message: 'Reservation updated successfully.',
			});
		} else {
			r.status(404).json({
				success: false,
				error: 'Reservation not found.',
			});
		}
	} catch (e) {
		r.status(500).json({
			success: false,
			error: e.message,
		});
	}
});

/* LOGIN/REGISTER POST */

xj.post('/lu', async function(q, r) {
	const eml = q.body.email;
	const pwd = q.body.password;
	const persist = q.body.persist;
	if (!eml || !pwd || persist == null) {
		return r.status(400).json({
			success: false,
			error: 'Invalid request.',
		});
	}
	const login = await db.login(eml, pwd);
	if (login === 1) {
		q.session.email = eml;
		if (persist)
			q.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
		else
			q.session.cookie.expires = false;
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
		r.status(400).json({
			success: false,
			error: 'User already exists.',
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
