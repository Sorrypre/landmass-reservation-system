let filter_toggled = false;
let reservations = [];
let currentFilters = { date: 'default' };
let filter_user_search;

const filter_btn = document.getElementById("filter-btn")
const filter_cls_btn = document.getElementById("filter-close-btn");
const filter_clear_btn = document.getElementById("filter-clear-btn");
const filter_save_btn = document.getElementById("filter-save-btn");
const reserve_page_no = document.getElementById("reserve-page-no");
const reservation_next_btn = document.getElementById("next-btn");
const reservation_prev_btn = document.getElementById("prev-btn");
const reservation_list = document.getElementById("reservation-list");
const filter_all = document.getElementById("filter-all");
const filter_today = document.getElementById("filter-today");
const filter_tomo = document.getElementById("filter-tomo");
const back_btn = document.getElementById("back-to-dashboard");

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

function addRoomOptions() {
    const select_building = document.getElementById("filter-building-select");
    const select_room = document.getElementById("filter-room-select");

    select_building.addEventListener('change', (e) => {
        const selected_building = e.target.value;
        select_room.innerHTML = '<option selected hidden disabled>Pick Room</option>';

        if (selected_building && selected_building !== 'Pick Building' && building_map[selected_building]) {
            building_map[selected_building].forEach(room => {
                const option = document.createElement('option');
                option.value = room;
                option.textContent = room;
                select_room.appendChild(option);
            });
        }
    });
}

function Reservation(_id, name, building, room, request_date, request_time, reserve_date, seat, startTime, endTime, user_email) {
    this._id = _id;
    this.name = name;
    this.building = building;
    this.room = room;
    this.request_date = request_date;
    this.request_time = request_time;
    this.reserve_date = reserve_date;
    this.seat = seat;
    this.startTime = startTime;
    this.endTime = endTime;
    this.user_email = user_email;
}

function addReservation(i, n, b, r, req_d, req_t, res_d, s, strt_t, end_t, ue) {
    const reservation = new Reservation(i, n, b, r, req_d, req_t, res_d, s, strt_t, end_t, ue);
    reservations.push(reservation);
    console.log(reservations);
}

async function writeReservations() {
    const reservation_list = document.getElementById("reservation-list");
    reservation_list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    let z = reservations.length;

    reservations.forEach((reservation, res_index) => {
        const reservation_item = document.createElement("div");
        reservation_item.classList.add('reservation-item');
        reservation_item.style.zIndex = `${z--}`;

        reservation_item.innerHTML = `
            <h3><span class="font-bold">${reservation.building}</span></h3>
            <p>Requester: <span class="font-bold">${reservation.name}</span></p>
            <p>Room: <span class="font-bold">${reservation.room}</span></p>
            <p>Date of Request: <span class="font-bold">${reservation.request_date}</span></p>
            <p>Time of Request: <span class="font-bold">${reservation.request_time}</span></p>
            <p>Date of Reservation: <span class="font-bold">${reservation.reserve_date}</span></p>
            <p>Time: <span class="font-bold">${reservation.startTime} - ${reservation.endTime}</span></p>
            <p>Seat: <span class="font-bold" id="seat-name">${reservation.seat}</span></p>
        `;
        const right_most_btn = document.createElement("div");
        right_most_btn.classList.add('right-most-btn');

        //reservations can only be edited if its from today or the future
        if (reservation.reserve_date >= formatDateString(new Date())) {
            const edit_btn = document.createElement("button");
            edit_btn.classList.add('edit-btn');
            edit_btn.innerHTML = `Edit Reservation`;
            edit_btn.addEventListener('click', () => {
                createEditReservationDialog(reservation)
            });
            right_most_btn.appendChild(edit_btn);
        }

        const delete_edit_btn = document.createElement("button");
        delete_edit_btn.classList.add('edit-btn');
        delete_edit_btn.innerHTML = `Delete Reservation`;
        //confirm delete
        createDeleteDialog(res_index, delete_edit_btn);
        right_most_btn.appendChild(delete_edit_btn);
        reservation_item.appendChild(right_most_btn);
        fragment.appendChild(reservation_item);
    });

    reservation_list.appendChild(fragment);
}

function updatePageNumber() {
    const reservation_items = document.getElementsByClassName('reservation-item');
    const totalPages = reservation_items.length;

    if (totalPages === 0) return;

    let current_page = 1;
    let max_z = -1;
    for (let i = 0; i < reservation_items.length; i++) {
        const z = parseInt(reservation_items[i].style.zIndex);
        if (z > max_z) {
            max_z = z;
            current_page = i + 1;
        }
    }

    let start_page = Math.max(1, current_page - 2);
    let end_page = Math.min(totalPages, current_page + 2);

    let page_text = '';
    for (let i = start_page; i <= end_page; i++) {
        if (i === current_page) {
            page_text += `<span class="font-bold text-white">${i}</span>  `;
        } else {
            page_text += `<span class="bg-[#212D40] text-white p-1 rounded">${i}</span>  `;
        }
    }

    if (reserve_page_no) {
        reserve_page_no.innerHTML = page_text;
    }
}

function prevReservation() {
    let reservation_items = document.getElementsByClassName('reservation-item');
    let z_indices = [];

    for (let i = 0; i < reservation_items.length; i++)
        z_indices.push(parseInt(reservation_items[i].style.zIndex));

    let max_z = Math.max(...z_indices);

    if (max_z > 1) {
        let current_index = z_indices.indexOf(max_z);
        let prev_index = (current_index - 1 + z_indices.length) % z_indices.length;

        let temp = z_indices[current_index];
        z_indices[current_index] = z_indices[prev_index];
        z_indices[prev_index] = temp;

        for (let i = 0; i < reservation_items.length; i++)
            reservation_items[i].style.zIndex = '' + z_indices[i];

        updatePageNumber();
    }
}

function nextReservation() {
    let reservation_items = document.getElementsByClassName('reservation-item');
    let z_indices = [];

    for (let i = 0; i < reservation_items.length; i++)
        z_indices.push(parseInt(reservation_items[i].style.zIndex));

    let max_z = Math.max(...z_indices);

    if (max_z > 1) {
        let current_index = z_indices.indexOf(max_z);
        let next_index = (current_index + 1) % z_indices.length;

        let temp = z_indices[current_index];
        z_indices[current_index] = z_indices[next_index];
        z_indices[next_index] = temp;

        for (let i = 0; i < reservation_items.length; i++)
            reservation_items[i].style.zIndex = '' + z_indices[i];

        updatePageNumber();
    }
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
        //date of filter option, today, all, tomorrow
        if (currentFilters.date) filterParam.push(`date=${encodeURIComponent(currentFilters.date)}`);
        if (currentFilters.username) filterParam.push(`username=${encodeURIComponent(currentFilters.username)}`);

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
                    res._id,
                    res.requestor,
                    res.building,
                    res.room,
                    formatDateString(res.dt_request),
                    formatTimeString(res.dt_request),
                    formatDateString(res.startTime),
                    res.seat,
                    formatTimeString(res.startTime),
                    formatTimeString(res.endTime),
                    res.user_email
                );
            });

            //sort by reservation date then start time
            reservations.sort((a, b) => {
                const dateA = new Date(`${a.reserve_date} ${a.startTime}`);
                const dateB = new Date(`${b.reserve_date} ${b.startTime}`);
                return dateA - dateB;
            });

            writeReservations();
        } else {
            reservation_list.innerHTML = '<p id="no-reservation">No Reservations</p>';
        }
        updatePageNumber();
    }
    catch (e) {
        console.error('Error fetching reservations:', e);
        reservation_list.innerHTML = '<p id="no-reservation">Error loading reservations. Please try again.</p>';
    }
}

async function removeReservation(reservation_index) {
    try {
        const res = reservations[reservation_index];

        const r = await fetch('/query-remove-reservation', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                reservation_id: res._id,
                user_email: res.user_email
            })
        });

        const data = await r.json();
        if (data.success) {
            await loadReservations();
        } else {
            console.error('Failed to remove reservation:', data.error);
        }
    } catch (e) {
        console.error('Error removing reservation:', e);
    }
}

function createDeleteDialog(reservation_index, delete_btn) {
    const dialog = `delete-confirm-reservation-${reservation_index}`;
    const msg = `Are you sure you want to delete this reservation?`;
    const res = `
        <button type="button" class="page-dialog-message-button after:content-['Yes'] text-black" onclick="removeReservation(${reservation_index})"></button>
    `;

    make_dialog('reservation-list', ``, dialog, 'typical', 'Confirm Delete', false, false, msg, res);

    delete_btn.addEventListener('click', async() => {
        playAlert(); //temporary fix, must call button handler in make dialog
        await open_dialog(dialog);
    });
}

async function saveFilters() {
    const building = document.getElementById("filter-building-select").value;
    const room = document.getElementById("filter-room-select").value;
    const time = document.getElementById("filter-time-select").value;
    const username = (filter_user_search && !filter_user_search.classList.contains('hidden')) ? filter_user_search.value : '';
    const existing_date = currentFilters.date;

    currentFilters = {};
    if (building && building !== 'Pick Building') currentFilters.building = building;
    if (room && room !== 'Pick Room') currentFilters.room = room;
    if (time && time !== 'Pick Time') currentFilters.startTime = time;
    if (username) currentFilters.username = username;
    if (existing_date) currentFilters.date = existing_date;

    await loadReservations();
}

async function resetFilters() {
    document.getElementById("filter-building-select").value = 'Pick Building';
    document.getElementById("filter-room-select").value = 'Pick Room';
    document.getElementById("filter-time-select").value = 'Pick Time';
    if (filter_user_search) filter_user_search.value = '';

    currentFilters = { date: 'default' };
    await loadReservations();
}

function formatTimeString(dt_string) {
    const date = new Date(dt_string);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`
}

function formatDateString(dt_string) {
    const date = new Date(dt_string);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${month}/${day}/${year}`;
}

document.addEventListener('DOMContentLoaded', async() => {
    filter_user_search = document.getElementById("filter-user-search");
    reservation_list.innerHTML = '<div class="reservation-item" style="z-index: 1;"><p id="no-reservation">No Reservations</p></div>';

    addRoomOptions();
    await loadReservations();
    await addSearchUserInput();

    window.addEventListener('reservation-updated', loadReservations);

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
    if (filter_all) filter_all.addEventListener("click", () => {
        currentFilters.date = 'all';
        loadReservations();
    });
    if (filter_today) filter_today.addEventListener("click", () => {
        currentFilters.date = 'today'
        loadReservations();
    });
    if (filter_tomo) filter_tomo.addEventListener("click", () => {
        currentFilters.date = 'tomorrow'
        loadReservations();
    });
    if (filter_user_search) filter_user_search.addEventListener("change", () => { saveFilters() });
    if (reservation_next_btn) reservation_next_btn.addEventListener("click", nextReservation);
    if (reservation_prev_btn) reservation_prev_btn.addEventListener("click", prevReservation);
    if (back_btn)  back_btn.addEventListener('click', async function(e) {
            window.location.href = '/dashboard';
    });
});

async function addSearchUserInput() {
    try {
        const query = await fetch('/query-current-user', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const data = await query.json();

        if (data.success) {
            const user = JSON.parse(data.user)
            if (!user.admin && filter_user_search) {
                filter_user_search.classList.add('hidden');
                return true;
            }
        }
        return false;
    }
    catch(e) {
        console.error('Error Checking Lab Tech Status:', e);
        return false;
    }
}