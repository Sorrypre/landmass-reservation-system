//DOM elements
//button objects from IDs

//button for upload in 
const btn_confirm_pfp_pic = document.getElementById('change-profilepic-confirm-btn');
//button for save in edit profile information
const btn_save_pfp_info = document.getElementById('change-profile-submit-btn');
//button for save in change password
const btn_save_pfp_pwd = document.getElementById('change-password-submit-btn');

//form objects from IDs
const form_change_info = document.getElementById('change-info');
const form_change_pwd = document.getElementById('change-password');

//inputfile object from ID
const input_pfp = document.getElementById('input-file-pfp');
//form for the edit profile information
const form_input_user_n = document.getElementById('change-username');
const form_input_desc = document.getElementById('change-desc');
// form for the change password
const form_input_old_pwd = document.getElementById('old-password');
const form_input_new_pwd = document.getElementById('new-password');
const form_input_new_cfr_pwd = document.getElementById('confirm-new-password');

//status labels from the ID of span
const label_pfp = document.getElementById('change-pfp-status');

const label_user_n = document.getElementById('change-username-status');
const label_desc = document.getElementById('change-desc-status');

const label_old_pwd = document.getElementById('old-password-status');
const label_new_pwd = document.getElementById('change-new-password-status');
const label_cfr_pwd = document.getElementById('confirm-password-status');

const profilePic = document.getElementById('profilepic');
const initialProfilePic = document.getElementById('profilepic-initial');

const deleteAccountButton = document.getElementById('delete-account-button');

let go_back = document.querySelector("#back-to-dashboard-settings");
go_back.onclick = function (){
	window.location.href = "/dashboard";
};

input_pfp.onclick = function(){
    this.value = null;
}

input_pfp.onchange = function(){
    console.log('onchange is running');
    initialProfilePic.src = URL.createObjectURL(input_pfp.files[0]);
}

function cancelProfilePicChange(){
    input_pfp.value = null;
    initialProfilePic.src = profilePic.src;
}

const valid_pfp_ext = {
    'png' : 1,
    'jpg' : 1,
    'jpeg' : 1,
};

//change it for the username regex
const rxe = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

const pwd_min = 8;
const desc_max = 160;
const user_n_max = 45;

btn_confirm_pfp_pic.addEventListener('click', async (e) => {
    const file_rxe = new RegExp("/\\..+$/");
    const file_ext = (input_pfp.files[0].type).replace(/(.*)\//g, '');

    function alert_file_type_pfp(t){
        switch(t) {
            case 0:
                label_pfp.classList.add('pfp-invalid-type');
                break;
            case 1:
                label_pfp.classList.add('pfp-too-large');
                break;
        }
        label_pfp.style['display'] = 'inline';
        void label_pfp.offsetHeight;
        return true;
    }
    
    if(!input_pfp)
        return;
    if(valid_pfp_ext[file_ext]){
        console.log('file ext: ' + file_ext);
        console.log('submit photo to database');
        //insert post ajax api
        const reader = new FileReader();
        reader.readAsDataURL(input_pfp.files[0]);
        /* https://stackoverflow.com/a/74390975 */
        const base64photo = await new Promise(function (res, rej) {
            reader.onload = function(e) {
                res(e.target.result);
            }
        });
        let user = await fetch('/query-current-user', {
            method: 'GET',
            headers: { 'Content-Length': 0 },
        });
        
        const user_json = await user.json();
        const profile_change = await fetch('/query-modify-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                email: JSON.parse(user_json.user).settings.email,
                matchjson: JSON.stringify({}),
                updjson: JSON.stringify({ 'settings.photo': base64photo }),
            }),
        });
        //prototype to data validation
        if (profile_change.status === 413) {
            console.log('Picture size exceeds 5mb limit');
        }
        user = await fetch('/query-current-user', {
            method: 'GET',
            headers: { 'Content-Type': 0 },
        })
        const new_pfp_json = await user.json();
        const new_pfp_user = JSON.parse(new_pfp_json.user);
        const new_photo = new_pfp_user.settings.photo;
        profilePic.src = new_photo;
        if (profile_change.status === 413) {
            alert_file_type_pfp(1);
            console.log('an size error has occured and it will show the alert');
            return false;
        }
        return true;
    } else {
        alert_file_type_pfp(0);
        return false;
    }
});

// handle edit information
btn_save_pfp_info.addEventListener('click', async (e) => {
    function alert_new_username(t) {
        switch(t){
            case 0:
                label_user_n.classList.add('username-length-invalid');
                break;
            case 1:
                label_user_n.classList.add('username-taken');
                break;

        }
        label_user_n.style['display'] = 'inline';
        void label_user_n.offsetWidth;
        return true;
    }
    function alert_new_desc() {
        label_desc.classList.add('desc-length-invalid');
        label_desc.style['display'] = 'inline';
        void label_desc.offsetWidth;
        return true;
    }
    if (!form_input_user_n || !form_input_desc)
        return;
    //insert the array of users here
    const usersWithSameUsername = await fetch('/query-get-users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            matchjson: {'settings.username': form_input_user_n.value},
        }),
    });
    const json_get_same_usernames = await usersWithSameUsername.json();
    console.log(json_get_same_usernames.users.length);
    if(json_get_same_usernames.users.length === 0 && form_input_user_n.value.length <= user_n_max && form_input_desc.value.length <= desc_max){
       //edit so that when the input the length is 0 it will not send that
        let user = await fetch('/query-current-user', {
        method: 'GET',
        headers: { 'Content-Length': 0 },
        });
        const user_json = await user.json();
        const response = await fetch('/query-modify-user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', },
            body: JSON.stringify({
                email: JSON.parse(user_json.user).settings.email,
                matchjson: JSON.stringify({}),
                updjson: JSON.stringify({ 
                    'settings.username': form_input_user_n.value.length > 0  ? form_input_user_n.value : JSON.parse(user_json.user).settings.username,
                    'settings.bio': form_input_desc.value.length > 0 ? form_input_desc.value : JSON.parse(user_json.user).settings.bio
                 }),
            }),
        });
        window.location.reload();
        return true;
    } else {
        if (json_get_same_usernames.users.length > 0)
            alert_new_username(1);
        if(form_input_user_n.value.length > user_n_max)
            alert_new_username(0);
        if(form_input_desc.value.length > desc_max)
            alert_new_desc();
        return false;
    }
});
btn_save_pfp_pwd.addEventListener('click', async (e) => {
    function alert_old_pwd(t) {
        switch(t) {
            case 0:
                label_old_pwd.classList.add('old-password-empty');
                break;
            case 1:
                label_old_pwd.classList.add('old-password-mismatch');
                break;
        }
        label_old_pwd.style['display'] = 'inline';
        void label_old_pwd.offsetWidth;
        return true;
    }

    function alert_new_pwd(t) {
        switch(t) {
            case 0:
                label_new_pwd.classList.add('new-password-empty');
                break;
            case 1:
                label_new_pwd.classList.add('new-password-short');
                break;
        }
        label_new_pwd.style['display'] = 'inline';
        void label_new_pwd.offsetWidth;
        return true;
    }

    function alert_confirm_new_pwd(t) {
        switch(t) {
            case 0:
                label_cfr_pwd.classList.add('confirm-password-empty');
                break;
            case 1:
                label_cfr_pwd.classList.add('confirm-password-mismatch');
                break;
        }
        label_cfr_pwd.style['display'] = 'inline';
        void label_cfr_pwd.offsetWidth;
        return true;
    }
    if(!form_input_old_pwd || !form_input_new_pwd || !form_input_new_cfr_pwd)
        return;
    //get the old password from the database and compare the input in the form
    let user = await fetch('/query-current-user', {
    method: 'GET',
    headers: { 'Content-Length': 0 },
    });
    const user_json = await user.json();
    const form_input_old_pwd_value = form_input_old_pwd.value;
    const current_user_email = JSON.parse(user_json.user).settings.email;
    try {
        const verifyOldPassword = await fetch('/lu', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: current_user_email, 
                password: form_input_old_pwd_value
            }),
        });
        if (verifyOldPassword.ok && form_input_old_pwd.value.length > 0 && form_input_new_pwd.value.length >= pwd_min && form_input_new_cfr_pwd.value === form_input_new_pwd.value){
            //change and edit so that only the new password wil be submitted to the database
            const response = await fetch('/query-change-password', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', },
                body: JSON.stringify({
                    email: JSON.parse(user_json.user).settings.email,
                    password: form_input_new_pwd.value
                }),
            });

        } else {
            //if the old password does not match what is inside the database
            if(!verifyOldPassword.ok)
                alert_old_pwd(1);

            //to check if the input boxes are not empty
            if(form_input_old_pwd.value.length === 0)
                alert_old_pwd(0);
            if(form_input_new_pwd.value.length === 0)
                alert_new_pwd(0);
            if(form_input_new_cfr_pwd.value.length === 0)
                alert_confirm_new_pwd(0);

            //add the alert of database password mismatch here when it is implemented
            if(form_input_new_pwd.value.length < pwd_min)
                alert_new_pwd(1);
            if(form_input_new_cfr_pwd.value !== form_input_new_pwd.value){
                alert_confirm_new_pwd(1);

            }
            return false;
        }
    } catch(e){
        console.error('An unexpected error has occured.');
    }
    form_input_old_pwd.value = '';
    form_input_new_pwd.value = '';
    form_input_new_cfr_pwd.value = '';
});
input_pfp.addEventListener('change', () => {
    if(label_pfp.classList.length !== 0) {
        label_pfp.className = 'change-invalid';
        void label_pfp.offsetWidth;
    }
});

form_input_user_n.addEventListener('input', () => {
    if(label_user_n.classList.length !== 0) {
        label_user_n.className = 'change-invalid';
        void label_user_n.offsetWidth;
    }
});

form_input_desc.addEventListener('input', () => {
    if(label_desc.classList.length !== 0) {
        label_desc.className = 'change-invalid';
        void label_desc.offsetWidth;
    }
});
form_input_old_pwd.addEventListener('input', () => {
    if(label_old_pwd.classList.length !== 0) {
        label_old_pwd.className = 'change-invalid';
        void label_old_pwd.offsetWidth;
    }
});

form_input_new_pwd.addEventListener('input', () => {
    if(label_new_pwd.classList.length !== 0) {
        label_new_pwd.className = 'change-invalid';
        void label_new_pwd.offsetWidth;
    }
});

form_input_new_cfr_pwd.addEventListener('input', () => {
    if(label_cfr_pwd.classList.length !== 0) {
        label_cfr_pwd.className = 'change-invalid';
        void label_cfr_pwd.offsetWidth;
    }
});

deleteAccountButton.addEventListener('click', async (e) => {
    let user = await fetch('/query-current-user', { 
        method: 'GET',
        headers: {'Content-Length': 0},
    });
    const user_json = await user.json();
    const change_active_status = await fetch('/query-modify-user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: JSON.parse(user_json.user).settings.email,
            matchjson: JSON.stringify({}),
            updjson: JSON.stringify({'settings.isActive': false })
        }),
    });
    if (change_active_status.ok)
        console.log('successfully changed status at ' + Date.now());
    else console.log('error-' + register.status + '-' + Date.now());
    const logout = await fetch('/lou', {
			method: 'POST',
			headers: { 'Content-Length': 0 },
    });
    if (logout.ok)
        window.location.href = '/';
    else
        console.error('Error upon logout (' + logout.status + '): ' + e);
});
