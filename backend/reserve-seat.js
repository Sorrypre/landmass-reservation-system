let roomname = localStorage.getItem("room-name");
let room_text = document.querySelector(".reserve-room-text");
if(roomname && room_text){
	room_text.innerHTML = roomname;
}

let go_back = document.querySelector("#go-back-container .go-back-text");
go_back.onclick = function (){
	window.location.href = "/rr";
};

let container = document.getElementById("slots-container");

container.addEventListener("click", (e) => {
	if(e.target.classList.contains('seat')){
		console.log("Seat clicked:", e.target.dataset.pc);
		e.target.classList.toggle("selected");
	}

});

const modal = document.getElementById('confirm-modal-container');

function openModal() {
	console.log('open')
	modal.classList.remove('hidden');
	modal.classList.add('flex');
}

function closeModal() {
	modal.classList.remove('flex');
	modal.classList.add('hidden');
}

function returnDashboard(){
	window.location.href = '/dashboard';
}