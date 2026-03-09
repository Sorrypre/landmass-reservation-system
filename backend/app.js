const { setServers } = require('dns');
const mongoose = require('mongoose');
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const dns = require('dns');
const hbs = require('./hbs');
const session = require('./session');
const db = require('./db');
require('dotenv').config({ quiet: true });
setServers(['8.8.8.8', '8.8.4.4']);

const port = process.env.PORT;
const root_dir = path.join(__dirname, '..');

const xj = express();
xj.use(express.urlencoded({ extended: true }));
xj.use(express.json());
xj.use(express.static(root_dir));
xj.engine('handlebars', handlebars.engine());
xj.set('view engine', 'handlebars');
xj.set('views', './frontend/pages');

xj.get('/', async function(q, r) {
	const rand = Math.floor(Math.random() * 10000);
	const hash = await session.h512('password' + rand, undefined);
	const email = 'example.user' + rand + '@gmail.com';
	await db.register(email, hash.hashed, hash.salt);
	r.render('login', hbs.getTemplate('login'));
});

/*
xj.get('/testview', function(q,r) {
	r.render('reserve-seat', hbs.getTemplate('reserve-seat'));
});
*/

db.connect().then(function(msg) {
	console.log(msg);
	xj.listen(port, function() {
		console.log('server is now on listen @ port ' + port);
	});
}).catch(function(e) {
	console.error('unable to reach mongodb cluster | ' + e.message);
	process.exit(1);
});
