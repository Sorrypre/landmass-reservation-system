let filter_toggled = false;
let reservations = [];
let currentFilters = { };

const filter_btn = document.getElementById("filter-btn")
const filter_cls_btn = document.getElementById("filter-close-btn");
const filter_clear_btn = document.getElementById("filter-clear-btn");
const filter_save_btn = document.getElementById("filter-save-btn");
const reserve_page_no = document.getElementById("reserve-page-no");
const reservation_next_btn = document.getElementById("next-btn");
const reservation_prev_btn = document.getElementById("prev-btn");
const reservation_list = document.getElementById("reservation-list");

function toggleFilter() {
    const filter_box = document.getElementById("filter-box");
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

function updatePageNumber() {
    const reservation_items = document.getElementsByClassName('reservation-item');
    let currentIndex = 0;

    let max_z = -1;
    for (let i = 0; i < reservation_items.length; i++) {
        const z = parseInt(reservation_items[i].style.zIndex);
        if (z > max_z) {
            max_z = z;
            currentIndex = i;
        }
    }

    if (reserve_page_no) {
        reserve_page_no.textContent = `${currentIndex + 1} / ${reservation_items.length}`;
    }
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

    updatePageNumber();
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

    updatePageNumber();
}

async function loadReservations() {
    try {
        const reservation_list = document.getElementById("reservation-list");
        reservation_list.innerHTML = '';

        let url = '/query-get-reservations?';
        const filterParam = [];


        if (currentFilters.building) filterParam.push(`building=${encodeURIComponent(currentFilters.building)}`);
        if (currentFilters.room) filterParam.push(`room=${encodeURIComponent(currentFilters.room)}`);
        if (currentFilters.startTime) filterParam.push(`startTime=${encodeURIComponent(currentFilters.startTime)}`);
        if (currentFilters.date) filterParam.push(`date=${encodeURIComponent(currentFilters.date)}`);
        if (currentFilters.requestor) filterParam.push(`requestor=${encodeURIComponent(currentFilters.requestor)}`);

        url += filterParam.join('&');

        const query = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const data = await query.json();
        reservations = [];

        if (data.success && data.reservations.length > 0) {
            data.reservations.forEach(res => {
                const reqDate = new Date(res.dt_request);
                const startTime = new Date(res.startTime);
                const endTime = new Date(res.endTime);

                addReservation(
                    res.requestor,
                    res.building,
                    res.room,
                    reqDate.toLocaleDateString(),
                    reqDate.toLocaleTimeString(),
                    startTime.toLocaleDateString(),
                    res.seats,
                    startTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}),
                    endTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})
                );
            });
            writeReservations();
        } else {
            reservation_list.innerHTML = '<p id="no-reservation">No reservations found.</p>';
        }
        updatePageNumber();
    }
    catch (e) {
        console.error('Error fetching reservations:', e);
        reservation_list.innerHTML = '<p id="no-reservation">Error loading reservations. Please try again.</p>';
    }
}

function saveFilters() {
    const building = document.getElementById("filter-building-select").value;
    const room = document.getElementById("filter-room-select").value;
    const time = document.getElementById("filter-time-select").value;
    const username = filter_user_search.value;

    currentFilters = {};
    if (building && building !== 'Pick Building') currentFilters.building = building;
    if (room && room !== 'Pick Room') currentFilters.room = room;
    if (time && time !== 'Pick Time') {
        const hour = time.substring(0, 2);
        const minute = time.substring(2, 4);
        currentFilters.startTime = `${hour}:${minute}`;
    }
    if (username) currentFilters.username = username;

    loadReservations();
}

function resetFilters() {
    document.getElementById("filter-building-select").value = 'Pick Building';
    document.getElementById("filter-room-select").value = 'Pick Room';
    document.getElementById("filter-time-select").value = 'Pick Time';
    if (filter_user_search) filter_user_search.value = '';

    currentFilters = {};
    loadReservations();
}

document.addEventListener('DOMContentLoaded', async() => {
    reservation_list.innerHTML = '<div class="reservation-item" style="z-index: 1;"><p id="no-reservation">No reservations found.</p></div>';

    //await loadReservations();
    await checkLabTechStatus();

    if (filter_btn) filter_btn.addEventListener("click", toggleFilter);
    if (filter_cls_btn) filter_cls_btn.addEventListener("click", toggleFilter);
    if (filter_save_btn) filter_save_btn.addEventListener("click", () => {
        saveFilters();
        toggleFilter();
    });
    if (filter_clear_btn) filter_clear_btn.addEventListener("click", () => {
        resetFilters();
        toggleFilter();
    });
    if (reservation_next_btn) reservation_next_btn.addEventListener("click", nextReservation);
    if (reservation_prev_btn) reservation_prev_btn.addEventListener("click", prevReservation);
});
