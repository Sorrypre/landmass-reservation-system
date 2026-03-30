const db = require('./db');

const DIALOG_ID_PREFIX = 'mlcndlg-';
const PREFIX_CLOSE_BUTTON = '\u{20603}'; /* Chu Nom of Vietnamese 'đóng' (to seal shut) */
const PREFIX_DIALOG_MESSAGE = '\u{20D0D}'; /* Chu Nom of Vietnamese 'nhắn' (to leave a message) */
const PREFIX_DIALOG_RESPONSES = '\u{20CD2}'; /* Chu Nom of Vietnamese 'lời' (word; response) */

const dialog_config_template = {
	config: {
		dialog_name_prefix: DIALOG_ID_PREFIX,
		dialog_close_prefix: PREFIX_CLOSE_BUTTON,
		dialog_content_prefix: PREFIX_DIALOG_MESSAGE,
		dialog_responses_prefix: PREFIX_DIALOG_RESPONSES,
	}
}

function getDialogTemplate(dialog_layouts) {
	if (!Array.isArray(dialog_layouts))
		throw new Error('getDialogTemplate: parameter type mismatch');
	return {
		...dialog_config_template,
		layout: false,
		dialogs: dialog_layouts,
	}
}

async function getTemplate(id, email) {
	const user = await db.getUser(email, {});
	const result = user !== null;
	const username = result ? user.settings.username : 'Username';
    const description = result ? user.settings.bio : '';
	const pfp_photo = result && user.settings.photo !== '' ? user.settings.photo : '../frontend/assets/images/pexels-cottonbro-7166828.jpg'
	return {
		'login': {
			user: false,
			scripts: ['dialog.js', 'index.js'],
			bg: 'dashboard',
			photo: pfp_photo,
		},
		'dashboard': {
			user: result,
			scripts: ['dashboard.js'],
			bg: 'dashboard',
			photo: pfp_photo,
		},
		'buildings': {
			user: result,
			scripts: ['buildings.js'],
			bg: 'dlsuBuildings',
			photo: pfp_photo,
		},
		'reservation-list': {
			user: result,
			scripts: ['main.js', 'alert_sound.js','dialog.js', 'profile_dialog.js', 'edit-reservation.js','reservation-list.js'],
			bg: 'reservation-list',
			photo: pfp_photo,
		},
		'reserve-seat': {
			user: result,
			scripts: ['reserve-seat.js'],
			bg: 'dashboard',
			page_classes: 'reservation-seat',
			photo: pfp_photo,
		},
		'settings': {
			user: result,
			scripts: ['settings_collapse.js', 'eyeTool.js','alert_sound.js','dialog.js','settings_reset_warning.js', 'settingsDataValidation.js'],
			bg: 'dlsuBuildings',
			username: username,
			description: description,
			email: email,
			photo: pfp_photo,
		},
		'about': {
			user: result,
			scripts: [],
			bg: 'dashboard',
			photo: pfp_photo,
		}
		/*	add more keys here with the corresponding Handlebars arguments as value
			depende kung anong page ang irerender */
	}[id.toLowerCase()];
}

module.exports.getTemplate = getTemplate;
module.exports.getDialogTemplate = getDialogTemplate;
