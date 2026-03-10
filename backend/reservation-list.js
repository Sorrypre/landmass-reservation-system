let nav_toggled = false;
let filter_toggled = false;

const reservations = [];

const filter_btn = document.getElementById("filter-btn")
const filter_cls_btn = document.getElementById("filter-close-btn");
const filter_save_btn = document.getElementById("filter-save-btn");
const reserve_page_no = document.getElementById("reserve-page-no");
const reservation_next_btn = document.getElementById("next-btn");
const reservation_prev_btn = document.getElementById("prev-btn");

function toggleFilter() {
    var filter_box = document.getElementById("filter-box");
    if (filter_toggled) {
        filter_box.classList.remove('flex');
        filter_box.classList.add('hidden');
    } else {
        filter_box.classList.remove('hidden');
        filter_box.classList.add('flex');
    }
    filter_toggled = !filter_toggled;
}

function Reservation(name, building, room, request_date, request_time, reserve_date, seats, start_time, end_time) {
    this.name = name;
    this.building = building;
    this.room = room;
    this.request_date = request_date;
    this.request_time = request_time;
    this.reserve_date = reserve_date;
    this.seats = seats;
    this.start_time = start_time;
    this.end_time = end_time;
}

function addReservation(n, b, r, req_d, req_t, res_d, s, strt_t, end_t) {
    const reservation = new Reservation(n, b, r, req_d, req_t, res_d, s, strt_t, end_t);
    reservations.push(reservation);
    console.log(reservations);
}

function writeReservations() {
    const reservation_list = document.getElementById("reservation-list");

    let z = 5;
    reservations.forEach(reservation => {
        const reservation_item = document.createElement("div");
        const seat_list = document.createElement("div");
        const right_most_btn = document.createElement("div");
        const save_edit_btn = document.createElement("button");

        reservation_item.classList.add('reservation-item');
        right_most_btn.classList.add('right-most-btn');
        seat_list.classList.add('seat-list');
        save_edit_btn.id = "save-edit-btn";

        reservation_item.style.zIndex = "" + z;
        save_edit_btn.innerHTML = `Save Edited Reservation`;

        reservation_item.innerHTML = `
            <h3> <span class="font-bold">${reservation.building}</span></h3>
            <p>Requester: <span class="font-bold">${reservation.name}</span></p>
            <p>Room: <span class="font-bold">${reservation.room}</span></p>
            <p>Date of Request: <span class="font-bold">${reservation.request_date}</span></p>
            <p>Time of Request: <span class="font-bold">${reservation.request_time}</span></p>
            <p>Date of Reservation: <span class="font-bold">${reservation.reserve_date}</span></p>
            <p>Time: <span class="font-bold">${reservation.start_time} - ${reservation.end_time}</span></p>
            <p>Seats: </p>
        `;
        reservation.seats.forEach(seat=> {
            const seat_item = document.createElement("div");
            seat_item.classList.add('seat-item');
            seat_item.innerHTML = `
                <p id="seat-name">${seat}</p>
                <button class="cross-btn" id="remove-seat-btn">&#128941</button>
            `;
            seat_list.appendChild(seat_item);
        });

        if (right_most_btn)
            right_most_btn.appendChild(save_edit_btn);
        if (reservation_item) {
            reservation_item.appendChild(seat_list)
            reservation_item.appendChild(right_most_btn)
        }
        if (reservation_list) {
            reservation_list.appendChild(reservation_item);
        }
        z--;
    });
}

function prevReservation() {
    let reservation_items = document.getElementsByClassName('reservation-item');
    let z_indices = [];
    for (let i = 0; i < reservation_items.length; i++)
        z_indices.push(parseInt(reservation_items[i].style.zIndex));
    let z_first = z_indices[0];
    for (let i = 0; i < z_indices.length - 1; i++)
        z_indices[i] = z_indices[i + 1];
    z_indices[z_indices.length - 1] = z_first;
    for (let i = 0; i < reservation_items.length; i++)
        reservation_items[i].style.zIndex = '' + z_indices[i];
}

function nextReservation() {
    let reservation_items = document.getElementsByClassName('reservation-item');
    let z_indices = [];
    for (let i = 0; i < reservation_items.length; i++)
        z_indices.push(parseInt(reservation_items[i].style.zIndex));
    let z_last = z_indices[z_indices.length - 1];
    for (let i = z_indices.length - 1; i > 0; i--)
        z_indices[i] = z_indices[i - 1];
    z_indices[0] = z_last;
    for (let i = 0; i < reservation_items.length; i++)
        reservation_items[i].style.zIndex = '' + z_indices[i];
}

const seats = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]];
addReservation("Joramm Dela Torre", "Gokongwei Building", "Room 203", "2026-01-14", "12:42","2026-01-15", seats[0], "07:30", "9:30");
addReservation("Kurt Laguerta", "Gokongwei Building", "Room 204", "2026-01-13", "15:21","2026-01-14", seats[1], "09:30", "11:30");
addReservation("Jensel Espada", "Gokongwei Building", "Room 205", "2026-01-12", "08:43","2026-01-13", seats[2], "13:30", "15:30");
addReservation("Kei Saguin", "Gokongwei Building", "Room 206", "2026-01-11", "09:51","2026-01-12", seats[3], "14:00", "16:00");
addReservation("Queenie Salao", "Gokongwei Building", "Room 207", "2026-01-10", "23:12","2026-01-11", seats[4], "10:00", "12:00");

writeReservations();
if (filter_btn) filter_btn.addEventListener("click", toggleFilter);
if (filter_cls_btn) filter_cls_btn.addEventListener("click", toggleFilter);
if (filter_save_btn) filter_save_btn.addEventListener("click", toggleFilter);
if (reservation_next_btn) reservation_next_btn.addEventListener("click", nextReservation);
if (reservation_prev_btn) reservation_prev_btn.addEventListener("click", prevReservation);
