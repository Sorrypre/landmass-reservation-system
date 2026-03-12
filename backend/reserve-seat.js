console.log("test");

let roomname = localStorage.getItem("room-name");
let room_text = document.querySelector(".reserve-room-text");
if (roomname && room_text) {
    room_text.innerHTML = roomname;
}

let go_back = document.querySelector("#go-back-container .go-back-text");
go_back.onclick = function () {
    window.location.href = "/rr";
};

let container = document.getElementById("slots-container");

container.addEventListener("click", (e) => {
    if (e.target.classList.contains('seat')) {
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

function returnDashboard() {
    window.location.href = '/dashboard';
}

const date_dropdown = document.querySelector("#reserved-date");
const time_dropdown = document.querySelector("#reserved-time");
const room_dropdown = document.querySelector("#reserved-room");

// Check if the IDs were actually found
console.log("Found date:", date_dropdown);
console.log("Found time:", time_dropdown);
console.log("Found room:", room_dropdown);

if (date_dropdown && time_dropdown && room_dropdown) {
    [date_dropdown, time_dropdown, room_dropdown].forEach(element => {
        element.addEventListener("change", e => {
            console.log("Change detected in:", e.target.id);
            if (date_dropdown.value && time_dropdown.value && room_dropdown.value) {
                checkAvailable();
            } else {
                console.log("waiting...");
            }
        });
    });
} else {
    console.error("Script failed: One or more IDs could not be found in the HTML.");
}

async function checkAvailable(){ // Add async
    let date = date_dropdown.value;
    let time = time_dropdown.value;
    let room = room_dropdown.value;
    let dateTime = date + "T" + time.slice(0,2) + ":" + time.slice(2) + ":00Z";

    // Add await
    const response = await fetch(`/api/get-seats?schedule=${dateTime}&room=${room}`);
    // Add await
    const data = await response.json(); 

    console.log(data.seats);
    // updateSeatUI(data.seats);
}

function updateSeatUI(data) {
    let seats = document.querySelectorAll(".seat");

    seats.forEach(s => {
        if (data.includes(Number(s.dataset.pc))) {
            s.classList.add("taken");
        } else {
            s.classList.remove("disabled");
        }
    });
}