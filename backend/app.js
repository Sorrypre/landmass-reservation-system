const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const hbs = require('./hbs.js');

const port = 2222;
const stat_dir = path.join(__dirname, '..');

const xj = express();
xj.use(express.urlencoded({ extended: true }));
xj.use(express.json());
xj.use(express.static(stat_dir));
xj.engine('handlebars', handlebars.engine());
xj.set('view engine', 'handlebars');
xj.set('views', './frontend/pages');

xj.get('/', function(q, r) {
	r.render('login', hbs.getTemplate('login'));
});

/*
xj.get('/testview', function(q,r) {
	r.render('reserve-seat', hbs.getTemplate('reserve-seat'));
});
*/

xj.listen(port, function() {
	console.log('server is now on listen @ port ' + port);
});
