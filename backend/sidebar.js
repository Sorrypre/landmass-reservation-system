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

const side_nav = document.getElementById("in-side-nav");
const hamburger = document.getElementById("hamburger-btn");

function toggleNav() {
	if (nav_toggled) {
		side_nav.style.width = "0px";
		side_nav.style.padding = "0px";
	} else {
		side_nav.style.width = "300px";
		side_nav.style.padding = "20px";
	}
	nav_toggled = !nav_toggled;
}

if (hamburger)
	hamburger.addEventListener("click", toggleNav);

if (redir_dashboard)
	redir_dashboard.addEventListener('click', async function(e) {
		if (await isServer())
			window.location.href = '/dashboard';
		else
			window.location.href = './dashboard.html';
	});

if (redir_reserve_seats)
	redir_reserve_seats.addEventListener('click', async function(e) {
		if (await isServer())
			window.location.href = '/b';
		else
			window.location.href = './DLSU-buildings.html';
	});

if (redir_see_reservations)
	redir_see_reservations.addEventListener('click', async function(e) {
		if (await isServer())
			window.location.href = '/reservations';
		else
			window.location.href = './reservation-list.html';
	});

if (redir_account_settings)
	redir_account_settings.addEventListener('click', async function(e) {
		if (await isServer())
			window.location.href = '/account';
		else
			window.location.href = './settings.html';
	});

if (redir_contact_us)
	redir_contact_us.addEventListener('click', async function(e) {
		if (await isServer())
			window.location.href = '/about';
		else
			window.location.href = './about.html';
	});

if (redir_log_out)
	redir_log_out.addEventListener('click', async function(e) {
		if (await isServer())
			window.location.href = '/lou';
		else
			return;
	});