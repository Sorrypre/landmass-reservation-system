const redir_dashboard = document.getElementById('redir-dashboard');
const redir_reserve_seats = document.getElementById('redir-reserve-seats');
const redir_see_reservations = document.getElementById('redir-see-reservations');
const redir_account_settings = document.getElementById('redir-account-settings');
const redir_contact_us = document.getElementById('redir-contact-us');
const redir_log_out = document.getElementById('redir-log-out');

async function isServer() {
	try {
		const r = await fetch('http://127.0.0.1:2222', {
			method: 'HEAD',
			mode: 'no-cors'
		});
		return true;
	} catch (e) {
		return false;
	}
}

redir_dashboard.addEventListener('click', async function(e) {
	if (await isServer())
		window.location.href = '/dashboard';
	else
		window.location.href = './dashboard.html';
});

redir_reserve_seats.addEventListener('click', async function(e) {
	if (await isServer())
		window.location.href = '/b';
	else
		window.location.href = './DLSU-buildings.html';
});

redir_see_reservations.addEventListener('click', async function(e) {
	if (await isServer())
		window.location.href = '/reservations';
	else
		window.location.href = './reservation-list.html';
});

redir_account_settings.addEventListener('click', async function(e) {
	if (await isServer())
		window.location.href = '/account';
	else
		window.location.href = './settings.html';
});

redir_contact_us.addEventListener('click', async function(e) {
	if (await isServer())
		window.location.href = '/about';
	else
		window.location.href = './about.html';
});

redir_log_out.addEventListener('click', async function(e) {
	if (await isServer())
		window.location.href = '/lou';
	else
		return;
});