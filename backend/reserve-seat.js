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
    let success = reserveSummary();
    if(success) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
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

async function reserveSeatForm(){
    let bldgName = document.getElementsByClassName("reserve-bldg-text").innerHTML();
    
    let endTime = (Number(time_dropdown.value) + 200).toString().padStart(4,'0');
    let startDateTime = `${date_dropdown.value}T${time_dropdown.value.slice(0, 2)}:${time_dropdown.value.slice(2)}:00Z`;
    let endDateTime = `${date_dropdown.value}T${endTime.slice(0, 2)}:${endTime.slice(2)}:00Z`;


    const selected_seats = document.querySelectorAll("#slots-container .seat.selected");
    if(selected_seats === null){
        alert("Choose >1 seat");
        return false;
    }
    console.log(selected_seats);
    let seatList = Array.from(selected_seats).map(s => s.dataset.pc).join(", ");
    
    const reservation = {
            dt_request: Date,
            details: {
                requestor: sessionUsername,
                building: bldg,
                room: room,
                startTime: startDateTime,
                endTime: endDateTime,
                seats: seats,
            }
        }
    try {
        console.log("entered reserveSeatForm")
        let {bldg, room, startT, endT, seats, email} = req.body;

        // const response = await fetch(`/reserve-seat/api/get-seats?start=${dateTime}&room=${room}`);
        const response = await fetch('/reserve-seat/api/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                startT: startDateTime,
                endT: endDateTime,
                seats: seatList,
                room: room_dropdown.value,
                bldg: bldgName,
            })
        });
        const data = await response.json();
        // console.log(ror);
        // This prevents the <!DOCTYPE HTML error
        if (!response.ok) {
            console.error("Server returned HTML error instead of JSON");
            return;
        }
        console.log("exiting reserveSeatForm")

        updateSeatUI(data.seats);
        // const data = await response.text();
        // console.log(data);
        // updateSeatUI(data.seats);
    } catch (err) {
        console.error("Network or Parsing error:", err);
    }
}
function reserveSummary(){
    let endTime = (Number(time_dropdown.value) + 200).toString().padStart(4,'0');

    const selected_seats = document.querySelectorAll("#slots-container .seat.selected");
    if(selected_seats === null){
        alert("Choose >1 seat");
        return false;
    }
    console.log(selected_seats);
    let seatList = Array.from(selected_seats).map(s => s.dataset.pc).join(", ");
    

    const string = `Date: ${date_dropdown.value}
    Start Time: ${time_dropdown.value}
    End Time: ${endTime}
    Room: ${room_dropdown.value}
    Seat list: ${seatList}`;

    let modalDetails = document.querySelector("#modal-details")
    if(modalDetails) {
        modalDetails.innerText = string;
    }
    return true;
}
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

async function checkAvailable() { 
    let date = date_dropdown.value;
    let time = time_dropdown.value;
    let room = room_dropdown.value;
    let dateTime = `${date}T${time.slice(0, 2)}:${time.slice(2)}:00Z`;

    if (!date || !time || !room || time.includes("Pick") || room.includes("Pick")) {
        console.log("Waiting for valid selections...");
        return;
    }
    let requestTime = new Date(dateTime);

    try {
        console.log("test1")
        const response = await fetch(`/reserve-seat/api/get-seats?start=${dateTime}&room=${room}`);
        // const response = await fetch('/reserve-seat/api/get-seats', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', },
        //     body: JSON.stringify({
        //         start: dateTime,
        //         room: room,
        //     })
        // });
        const data = await response.json();
        // console.log(ror);
        // This prevents the <!DOCTYPE HTML error
        if (!response.ok) {
            console.error("Server returned HTML error instead of JSON");
            return;
        }
        console.log("test2")

        updateSeatUI(data.seats);
        // const data = await response.text();
        // console.log(data);
        // updateSeatUI(data.seats);
    } catch (err) {
        console.error("Network or Parsing error:", err);
    }
}
function updateSeatUI(data) {
    let seats = document.querySelectorAll("#slots-container .seat");

    seats.forEach(s => {
        s.classList.remove("taken");
        s.classList.remove("selected");
        if (data.includes(Number(s.dataset.pc))) {
            s.classList.add("taken");
        } else {
            s.classList.remove("disabled");
        }
    });
}

