const mopt_reserve = document.getElementById('menu-option-reserve');
const mopt_reservation = document.getElementById('menu-option-reservation');
const mopt_account = document.getElementById('menu-option-account');

mopt_reserve.addEventListener('click', async function() {
	window.location.href = '/reserve-seat';
});

mopt_reservation.addEventListener('click', async function() {
	window.location.href = '/reservation-list';
});

mopt_account.addEventListener('click', async function() {
	window.location.href = '/settings';
});
