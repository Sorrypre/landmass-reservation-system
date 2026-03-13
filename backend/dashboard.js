const mopt_reserve = document.getElementById('menu-option-reserve');
const mopt_reservation = document.getElementById('menu-option-reservation');
const mopt_account = document.getElementById('menu-option-account');

mopt_reserve.addEventListener('click', async function() {
	if (await isServer())
		window.location.href = '/buildings';
	else
		window.location.href = './DLSU-buildings.html';
});

mopt_reservation.addEventListener('click', async function() {
	window.location.href = '/reservation-list';
});

mopt_account.addEventListener('click', async function() {
	window.location.href = '/settings';
});
