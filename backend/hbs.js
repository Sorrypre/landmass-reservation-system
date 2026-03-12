const db = require('./db');

async function getTemplate(id, email) {
	const user = await db.getUser(email);
	return {
		'login': {
			user: {},
			scripts: ['dialog.js', 'index.js'],
			bg: 'dashboard',
		},
		'dashboard': {
			user: JSON.stringify(user),
			scripts: ['dashboard.js'],
			bg: 'dashboard',
		},
		'buildings': {
			user: JSON.stringify(user),
			scripts: ['buildings.js'],
			bg: 'dlsuBuildings',
		},
		'reservation-list': {
			user: JSON.stringify(user),
			scripts: ['main.js', 'reservation-list.js'],
			bg: 'reservation-list',
		},
		'reserve-seat': {
			user: JSON.stringify(user),
			scripts: ['reserve-seat.js'],
			bg: 'dashboard',
			page_classes: 'reservation-seat',
		},
		/*	add more keys here with the corresponding Handlebars arguments as value
			depende kung anong page ang irerender */
	}[id.toLowerCase()];
}

module.exports.getTemplate = getTemplate;
