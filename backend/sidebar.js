const redir_dashboard = document.getElementById('redir-dashboard');
const redir_reserve_seats = document.getElementById('redir-reserve-seats');
const redir_see_reservations = document.getElementById('redir-see-reservations');
const redir_account_settings = document.getElementById('redir-account-settings');
const redir_contact_us = document.getElementById('redir-contact-us');
const redir_log_out = document.getElementById('redir-log-out');
const side_nav = document.getElementById("in-side-nav");
const hamburger = document.getElementById("hamburger-btn");

let nav_toggled = false;

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
		window.location.href = '/dashboard';
	});

if (redir_reserve_seats)
	redir_reserve_seats.addEventListener('click', async function(e) {
		if (await isServer())
			window.location.href = '/buildings';
		else
			window.location.href = './DLSU-buildings.html';
	});

if (redir_see_reservations)
	redir_see_reservations.addEventListener('click', async function(e) {
		window.location.href = '/reservation-list';
	});

if (redir_account_settings)
	redir_account_settings.addEventListener('click', async function(e) {
		window.location.href = '/settings';
	});

if (redir_contact_us)
	redir_contact_us.addEventListener('click', async function(e) {		
		window.location.href = '/about';
	});

if (redir_log_out)
	redir_log_out.addEventListener('click', async function(e) {
		const logout = await fetch('/lou', {
			method: 'POST',
			headers: { 'Content-Length': 0 },
		});
		if (logout.ok)
			window.location.href = '/';
		else
			console.error('Error upon logout (' + logout.status + '): ' + e);
	});