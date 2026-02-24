const express = require('express');
const cors = require('cors');
const path = require('path');
/*const fileURLToPath = require('url');*/

const login = require('./login.js');

const port = 2222;
const xj = express();
const stat_dir = path.join(__dirname, '..');

function checkUser(q, r, s) {
	s();
}

function page(file) {
	return path.join(stat_dir, 'frontend', 'pages', file);
}

xj.use(express.urlencoded({ extended: true }));
xj.use(express.json());
xj.use(express.static(stat_dir));
xj.use(cors());
xj.use(login);

xj.get('/', function(q, r) {
	r.sendFile(page('dashboard.html'));
});

xj.get('/dashboard', function(q, r) {
	r.sendFile(page('dashboard.html'));
});

xj.get('/reservations', function(q, r) {
	r.sendFile(page('reservation-list.html'));
});

xj.get('/account', function(q, r) {
	r.sendFile(page('settings.html'));
});

xj.get('/about', function(q, r) {
	r.sendFile(page('about.html'));
});

xj.get('/b', function(q, r) {
	r.sendFile(page('DLSU-buildings.html'));
});

xj.get('/rs', function(q, r) {
	r.sendFile(page('reserve-seat.html'));
});

xj.get('/rr', function(q, r) {
	r.sendFile(page('reserve-room.html'));
});

xj.get('/lou', function(q, r) {
	r.send('under construction');
});

xj.listen(port, function() {
	console.log('server is now on listen @ port ' + port);
});
