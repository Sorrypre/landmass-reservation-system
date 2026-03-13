const db = require('./db');

async function getTemplate(id, email) {
	const user = await db.getUser(email, {});
	const result = user !== null;
	const username = result ? user.settings.username : 'Username';
    const description = result ? user.settings.bio : '';
	return {
		'login': {
			user: false,
			scripts: ['dialog.js', 'index.js'],
			bg: 'dashboard',
		},
		'dashboard': {
			user: result,
			scripts: ['dashboard.js'],
			bg: 'dashboard',
		},
		'buildings': {
			user: result,
			scripts: ['buildings.js'],
			bg: 'dlsuBuildings',
		},
		'reservation-list': {
			user: result,
			scripts: ['main.js','reservation-list.js'],
			bg: 'reservation-list',
		},
		'reserve-seat': {
			user: result,
			scripts: ['reserve-seat.js'],
			bg: 'dashboard',
			page_classes: 'reservation-seat',
		},
		'settings': {
			user: result,
			scripts: ['settings_collapse.js', 'eyeTool.js','dialog.js','settings_reset_warnings.js', 'settingsDataValidation.js'],
			bg: 'dlsuBuildings',
			username: username,
			description: description,
			email: email,
		}
		/*	add more keys here with the corresponding Handlebars arguments as value
			depende kung anong page ang irerender */
	}[id.toLowerCase()];
}

module.exports.getTemplate = getTemplate;
