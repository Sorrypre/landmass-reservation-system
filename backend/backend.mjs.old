// Externals
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Server files
import login from './login.mjs';
// ...

// q = reQuest
// r = Response
// s = Success
function checkUser(q, r, s) {
	// For now, pasok lang nang pasok
	s();
}

const port = 2222;
const xj = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

xj.use(express.urlencoded({ extended: true }));
xj.use(express.json());
xj.use(express.static(path.join(__dirname, '../')));
xj.use(cors());
xj.use(login);

xj.get('/', (q, r) => {
	r.redirect('/frontend/pages/');
});

xj.get('/dashboard', checkUser, (q, r) => {
	r.redirect('/frontend/pages/dashboard.html');
});

xj.get('/reserve_seats', checkUser, (q, r) => {
	r.redirect('/frontend/pages/DLSU-buildings.html');
});

xj.get('/see_reservations', checkUser, (q, r) => {
	r.redirect('/frontend/pages/reservation-list.html');
});

xj.get('/account_settings', checkUser, (q, r) => {
	r.redirect('/frontend/pages/settings.html');
});

xj.get('/contact_us', checkUser, (q, r) => {
	r.redirect('/frontend/pages/about.html');
});

xj.get('/lou', checkUser, (q, r) => {
	r.send('under construction');
});

xj.listen(port, '127.0.0.1', () => {
	console.log('server is now on listen @ port ' + port);
});
