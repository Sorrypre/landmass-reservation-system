console.log("test");
document.addEventListener("DOMContentLoaded", async () => {
    let checkboxLbl= document.getElementById("anon-checkbox-label");
    try {
        const response = await fetch(`/query-current-user`);
        const userJson = await response.json();
        const email = JSON.parse(userJson.user).settings.email;    
        console.log(email);
        if(email === "admin@admin.com"){
            checkboxLbl.classList.add("hidden");
        } else{
            checkboxLbl.classList.remove("hidden");
        }
        
    } catch (e) {
        console.error("Failed to verify user role:", e);
    }
});

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
        // e.target.classList.toggle("selected");
        handleSeatClick(e);
    }

});

function handleSeatClick(e){
    const currSeat = e.target;

    if(currSeat.classList.contains("taken")){ return }
    document.querySelectorAll("#slots-container .seat.selected").forEach(s => {
        if(s!==currSeat){
            s.classList.remove("selected");
        }
    });
    currSeat.classList.toggle("selected");
}
const modal = document.getElementById('confirm-modal-container');
const adminInputField = document.getElementById('admin-only-requestor');

async function openModal() {
    console.log('open')
    const response = await fetch(`/query-current-user`);
    const userJson = await response.json();
    const username = JSON.parse(userJson.user).settings.email;    
    console.log(username);

    let success = reserveSummary();
    // const selected_seats = document.querySelectorAll("#slots-container .seat.selected");
    // if(selected_seats.length===0){
    //     alert("Choose a seat");
    //     return;
    // }

    if(username === "admin@admin.com"){
        adminInputField.classList.remove('hidden');
        adminInputField.classList.add('flex');
    } else {
        adminInputField.classList.add('hidden');
        adminInputField.classList.remove('flex');
    }
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
    reserveSeatForm();
}

const date_dropdown = document.querySelector("#reserved-date");
const time_dropdown = document.querySelector("#reserved-time");
const room_dropdown = document.querySelector("#reserved-room");

async function reserveSeatForm(){
    console.log("entered reserveSeatForm");
    let b = document.getElementById("reserve-bldg-text");
    let bldgName = b.innerText;
    
    let endTime = (Number(time_dropdown.value) + 200).toString().padStart(4,'0');
    let startDateTime = `${date_dropdown.value}T${time_dropdown.value.slice(0, 2)}:${time_dropdown.value.slice(2)}:00Z`;
    let endDateTime = `${date_dropdown.value}T${endTime.slice(0, 2)}:${endTime.slice(2)}:00Z`;

    let isAnon = document.getElementById("anon-checkbox").value;
    const selected_seat = document.querySelector("#slots-container .seat.selected");
    if(selected_seat.length===0){
        alert("Choose a seat");
        return;
    }
    console.log(selected_seat.dataset.pc);
    let seatList = selected_seat.dataset.pc;
    
    const response = await fetch(`/query-current-user`);
    const userJson = await response.json();
    const email = JSON.parse(userJson.user).settings.email;    
    let name = "";
    console.log(email);
    if(email === "admin@admin.com"){
        name = document.getElementById("admin-walk-in-input").value;
    }
    
    try {
        console.log("entered reserveSeatForm")

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
                anon: isAnon,
                name: name
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
        window.location.href = '/dashboard';
    } catch (err) {
        console.error("Network or Parsing error:", err);
    }

}
function reserveSummary(){
    let endTime = (Number(time_dropdown.value) + 200).toString().padStart(4,'0');

    const selected_seat = document.querySelector("#slots-container .seat.selected");
    if(selected_seat === null){
        alert("Choose >1 seat");
        return false;
    }
    console.log(selected_seat.dataset.pc);
    let seatList = selected_seat.dataset.pc
    

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


