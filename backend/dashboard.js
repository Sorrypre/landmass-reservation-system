const mopt_reserve = document.getElementById('menu-option-reserve');
const mopt_reservation = document.getElementById('menu-option-reservation');
const mopt_account = document.getElementById('menu-option-account');

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

mopt_reserve.addEventListener('click', async function() {
	if (await isServer())
		window.location.href = '/reserve-seat';
	else
		window.location.href = './DLSU-buildings.html';
});

mopt_reservation.addEventListener('click', async function() {
	if (await isServer())
		window.location.href = '/reservation-list';
	else
		window.location.href = './reservation-list.html';
});

mopt_account.addEventListener('click', async function() {
	if (await isServer())
		window.location.href = '/account';
	else
		window.location.href = './settings.html';
});
