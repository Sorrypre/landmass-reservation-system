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

btn_confirm_pfp_pic.addEventListener('click', (e) => {
    const file_rxe = new RegExp("/\\..+$/");
    const file_ext = (input_pfp.files[0].type).replace(/(.*)\//g, '');

    function alert_file_type_pfp(){
        label_pfp.classList.add('pfp-invalid-type');
        label_pfp.style['display'] = 'inline';
        void label_pfp.offsetHeight;
        return true;
    }
    
    if(!input_pfp)
        return;
    if(valid_pfp_ext[file_ext]){
        console.log('file ext: ' + file_ext);
        console.log('submit photo to database');
        return true;
    } else {
        alert_file_type_pfp();
        return false;
    }
});

// handle edit information
btn_save_pfp_info.addEventListener('click', (e) => {
    function alert_new_username() {
        label_user_n.classList.add('username-length-invalid');
        label_user_n.style['display'] = 'inline';
        void label_user_n.offsetWidth;
        return true;
    }
    function alert_new_desc(t) {
        label_desc.classList.add('desc-length-invalid');
        label_desc.style['display'] = 'inline';
        void label_desc.offsetWidth;
        return true;
    }
    if (!form_input_user_n || !form_input_desc)
        return;
    if(form_input_user_n.value.length <= user_n_max && form_input_desc.value.length <= desc_max){
        form_change_info.submit(); //edit so that when the input the length is 0 it will not send that
        return true;
    } else {
        if(form_input_user_n.value.length > user_n_max)
            alert_new_username();
        if(form_input_desc.value.length > desc_max)
            alert_new_desc();
        return false;
    }
});
btn_save_pfp_pwd.addEventListener('click', (e) => {
    function alert_old_pwd(t) {
        switch(t) {
            case 0:
                label_old_pwd.classList.add('old-password-empty');
                break;
            case 1:
                label_old_pwd.classList.add('old-password-mismatch');
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
        }
        label_cfr_pwd.style['display'] = 'inline';
        void label_cfr_pwd.offsetWidth;
        return true;
    }
    if(!form_input_old_pwd || !form_input_new_pwd || !form_input_new_cfr_pwd)
        return;
    //get the old password from the database and compare the input in the form
    if (form_input_old_pwd.value > 0 && form_input_new_pwd.value >= pwd_min && form_input_new_cfr_pwd.value === form_input_new_pwd.value){
        form_change_pwd.submit(); //change and edit so that only the new password wil be submitted to the database
        return true;
    } else {
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
});
input_pfp.addEventListener('change', () => {
    console.log('triggered but not doing anything');
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

