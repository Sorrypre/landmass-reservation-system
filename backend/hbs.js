function getTemplate(id) {
	return {
		'login': {
			user: {},
			scripts: ['index.js'],
			bg: 'dashboard',
		},
		/*	add more keys here with the corresponding Handlebars arguments as value
			depende kung anong page ang irerender */
	}[id.toLowerCase()];
}

module.exports.getTemplate = getTemplate;
