function getTemplate(id) {
	return {
		'login': {
			user: {},
			scripts: ['dialog.js', 'index.js'],
			bg: 'dashboard',
		},
		'dashboard': {
			user: {},
			scripts: ['dashboard.js'],
			bg: 'dashboard',
		},
		'buildings': {
			user: {},
			scripts: ['buildings.js'],
			bg: 'dlsuBuildings',
		},
		'reservation-list': {
			user: {},
			scripts: ['reservation-list.js'],
			bg: 'reservation-list',
		},
		'reserve-seat': {
			user: {},
			scripts: ['reserve-seat.js'],
			bg: 'dashboard',
			page_classes: 'reservation-seat',
		},
		/*	add more keys here with the corresponding Handlebars arguments as value
			depende kung anong page ang irerender */
	}[id.toLowerCase()];
}

module.exports.getTemplate = getTemplate;
