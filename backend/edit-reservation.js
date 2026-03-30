const time_list = [
    "0730", "0800", "0830", "0900", "0930",
    "1000", "1030", "1100", "1130", "1200",
    "1230", "1300", "1330", "1400", "1430",
    "1500", "1530", "1600", "1630", "1700"
];

let current_edit_res_id = null;
let current_user_email = null;
let edit_date_opt = null;
let edit_time_opt = null;
let edit_room_opt = null;
let edit_building_opt = null;
let selected_seat = null;

async function createEditReservationDialog(res) {
    const res_id = res._id;
    current_edit_res_id = res._id;
    current_user_email = res.user_email;
    selected_seat = res.seat;

    const dialog_name = `edit-reservation-dialog-${res_id}`;
    const dialog_id = `mlcndlg-${dialog_name}`;

    const existing = document.getElementById(dialog_id);
    if (existing) {
        existing.remove();
    }

    const html = `
        <div class="edit-reservation-form" id="edit-reservation-form-${res_id}">
            <div class="edit-form-section">
                <label for="edit-building-select-${res_id}">Building</label>
                <select id="edit-building-select-${res_id}" class="edit-option-select">
                    <option selected hidden disabled>Pick Building</option>
                    <option>Gokongwei Wing</option>
                    <option>Henry Sy Star</option>
                    <option>St. Lasalle Ship</option>
                </select>
            </div>

            <div class="edit-form-section">
                <label for="edit-room-select-${res_id}">Room</label>
                <select id="edit-room-select-${res_id}" class="edit-option-select">
                    <option selected hidden disabled>Pick Room</option>
                </select>
            </div>

            <div class="edit-form-section">
                <label for="edit-date-select-${res_id}">Date</label>
                <input type="date" id="edit-date-select-${res_id}">
            </div>

            <div class="edit-form-section">
                <label for="edit-time-select-${res_id}">Time</label>
                <select id="edit-time-select-${res_id}" class="edit-option-select">
                    <option selected hidden disabled>Pick Time</option>
                    ${time_list.map(time => `<option>${time}</option>`).join("")}
                </select>
            </div>

            <div class="edit-seat-selection">
                <div class="seat-legend">
                    <div class="edit-seat"></div> <span>Available</span>
                    <div class="edit-seat taken"></div> <span>Taken</span>
                    <div class="edit-seat selected"></div> <span>Selected</span>
                </div>
                <div id="edit-seats-container-${res_id}" class="seats-container">
                    <!-- seats filled by generateSeats -->
                </div>
            </div>
        </div>
    `;

    const responses = `
        <button type="button"
            class="page-dialog-message-button text-black"
            onclick="saveEditReservation('${res_id}')">Save Changes</button>
    `;

    make_dialog("reservation-list", "", dialog_name, "typical",
        "Edit Reservation", true, false, html, responses);

    const dialog_root = document.getElementById(dialog_id);
    if (!dialog_root) {
        console.error("Failed to create edit dialog");
        return;
    }

    edit_building_opt = dialog_root.querySelector(`#edit-building-select-${res_id}`);
    edit_room_opt = dialog_root.querySelector(`#edit-room-select-${res_id}`);
    edit_date_opt = dialog_root.querySelector(`#edit-date-select-${res_id}`);
    edit_time_opt = dialog_root.querySelector(`#edit-time-select-${res_id}`);

    if (edit_building_opt) {
        edit_building_opt.value = res.building;
    }

    if (edit_room_opt) {
        updateEditRoomOptions();
        edit_room_opt.value = res.room;
    }

    if (edit_date_opt && res.reserve_date) {
        const [mm, dd, yyyy] = res.reserve_date.split("/");
        edit_date_opt.value = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }

    if (edit_time_opt && res.startTime) {
        const t = res.startTime.replace(":", "");
        edit_time_opt.value = t;
    }

    const slot_container = dialog_root.querySelector(`#edit-seats-container-${res_id}`);
    if (slot_container) {
        generateSeats(slot_container);
    }

    if (edit_room_opt) edit_room_opt.onchange = checkEditAvailability;
    if (edit_date_opt) edit_date_opt.onchange = checkEditAvailability;
    if (edit_time_opt) edit_time_opt.onchange = checkEditAvailability;
    if (edit_building_opt) {
        edit_building_opt.onchange = () => {
            updateEditRoomOptions();
            checkEditAvailability();
        };
    }

    await checkEditAvailability();

    await open_dialog(dialog_name, true);
}

function updateEditRoomOptions() {
    const bldg = edit_building_opt.value;
    const rooms = building_map[bldg] || [];

    edit_room_opt.innerHTML = '<option selected hidden disabled>Pick Room</option>';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        edit_room_opt.appendChild(option);
    });
}

async function checkEditAvailability() {
    const date = edit_date_opt.value;
    const time = edit_time_opt.value;
    const room = edit_room_opt.value;

    if (!date || !time || !room || time.includes('Pick') || room.includes('Pick')) return;

    const dt = `${date}T${time.slice(0, 2)}:${time.slice(2)}:00Z`;

    try {
        const r = await fetch(`/reserve-seat/api/get-seats?start=${dt}&room=${room}`);
        const data = await r.json();

        if (r.ok) {
            updateEditSeatUI(data.seats || []);
        }
    } catch (e) {
        console.error('Error checking availability:', e);
    }
}

function generateSeats(container) {
    container.innerHTML = '';

    const layout = [
        [1, 2, 3, null, 4, 5, 6],
        [7, 8, 9, null, 10, 11, 12],
        [13, 14, 15, null, 16, 17, 18],
        [19, 20, 21, null, 22, 23, 24],
        [25, 26, 27, null, 28, 29, 'cis']
    ];

    const whiteboard = document.createElement('div');
    whiteboard.className = 'edit-whiteboard';
    whiteboard.textContent = 'Whiteboard';
    container.appendChild(whiteboard);

    layout.forEach(rowData => {
        const row = document.createElement('div');
        row.className = 'edit-row';

        rowData.forEach(cell => {
            if (cell === null) {
                const space = document.createElement('div');
                space.className = 'edit-space';
                row.appendChild(space);
            } else if (cell === 'cis') {
                const cis = document.createElement('div');
                cis.className = 'edit-cis';
                row.appendChild(cis);
            } else {
                const seat = generateSeat(cell);
                row.appendChild(seat);
            }
        });

        container.appendChild(row);
    });
}

function generateSeat(seat) {
    const seat_div = document.createElement('div');
    seat_div.className = 'edit-seat';
    seat_div.dataset.pc = seat;

    if (selected_seat === seat) {
        seat_div.classList.add('selected');
    }

    seat_div.addEventListener('click', () => {
        if (seat_div.classList.contains('taken')) return;

        const dialog_root = document.getElementById(`mlcndlg-edit-reservation-dialog-${current_edit_res_id}`);
        if (!dialog_root) return;

        dialog_root.querySelectorAll('.seats-container .edit-seat.selected').forEach(s => {
            if (s !== seat_div) s.classList.remove('selected');
        });

        seat_div.classList.toggle('selected');
        if (seat_div.classList.contains('selected')) {
            selected_seat = seat;
        } else {
            selected_seat = null;
        }
    });

    return seat_div;
}

function updateEditSeatUI(taken_seats) {
    const dialog_root = document.getElementById('mlcndlg-edit-reservation-dialog-' + current_edit_res_id);

    if (!dialog_root) return;

    const seats = dialog_root.querySelectorAll('.seats-container .edit-seat');

    seats.forEach(s => {
        const num = Number(s.dataset.pc);
        s.classList.remove('taken', 'selected');

        if (selected_seat === num) {
            s.classList.add('selected');
        } else if (taken_seats.includes(num)) {
            s.classList.add('taken');
        }
    });
}

async function saveEditReservation() {
    if (!edit_building_opt || !edit_room_opt || !edit_date_opt || !edit_time_opt) return;

    const bldg = edit_building_opt.value;
    const room = edit_room_opt.value;
    const date = edit_date_opt.value;
    const time = edit_time_opt.value;

    if (!date || !time || !edit_room_opt.value) {
        alert('Please fill out all fields and select a seat before saving.');
        return;
    }

    const start_t = `${date}T${time.slice(0, 2)}:${time.slice(2)}:00Z`;
    const endTimeRaw = (Number(time) + 200).toString().padStart(4, '0');
    const end_t = `${date}T${endTimeRaw.slice(0, 2)}:${endTimeRaw.slice(2)}:00Z`;

    try {
        const r = await fetch('/query-edit-reservation', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                reservation_id: current_edit_res_id,
                user_email: current_user_email,
                building: edit_building_opt.value,
                room: edit_room_opt.value,
                startTime: start_t,
                endTime: end_t,
                seat: selected_seat
            })
        });
        const data = await r.json();
        if (data.success) {
            await close_dialog('edit-reservation-dialog-' + current_edit_res_id);
            window.dispatchEvent(new CustomEvent('reservation-updated'));
        } else {
            alert(data.error || 'Failed to update reservation.');
        }
    } catch (e) {
        console.error('Error saving reservation:', e);
        alert('An error occurred while saving. Please try again.');
    }
}