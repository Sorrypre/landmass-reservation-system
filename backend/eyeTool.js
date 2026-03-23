const getInputsList = document.getElementsByClassName('input-password');

for(let i = 0; i < getInputsList.length; i++){
    let currentInputPasswordFaEye = document.querySelector('#' + getInputsList[i].getAttribute('id') + '~ .fa-eye');
    let currentInputPasswordFaEyeSlash = document.querySelector('#' + getInputsList[i].getAttribute('id') + '~ .fa-eye-slash');

    currentInputPasswordFaEye.addEventListener("click", () => {
        getInputsList[i].type = 'text';
        currentInputPasswordFaEyeSlash.classList.remove('hide');
        currentInputPasswordFaEye.classList.add('hide');
    });

    currentInputPasswordFaEyeSlash.addEventListener("click", () => {
        getInputsList[i].type = 'password';
        currentInputPasswordFaEyeSlash.classList.add('hide');
        currentInputPasswordFaEye.classList.remove('hide');
    });
}
function playAlert(){
    const alertAudio = new Audio();
    alertAudio.src = '../frontend/assets/audio/alertSound.mp3';
    alertAudio.play();
}

//migrate to settingsDataValidation.js for data validation of file size
// const profilePic = document.getElementById('profilepic');
// const initialProfilePic = document.getElementById('profilepic-initial');
// const inputFile = document.getElementById("input-file-pfp");
// const pfp_submit_btn = document.getElementById('change-profilepic-confirm-btn');
// let profileCancelBtn = document.getElementById('change-profilepic-cancel-btn');

// inputFile.onclick = function(){
// this.value = null;
// }
// inputFile.onchange = function(){
//     initialProfilePic.src = URL.createObjectURL(inputFile.files[0]);
// }
// function cancelProfilePicChange(){
//     inputFile.value = null;
//     initialProfilePic.src = profilePic.src;
// }

// pfp_submit_btn.addEventListener('click', async function confirmProfilePicChange() {
//     const reader = new FileReader();
//     reader.readAsDataURL(inputFile.files[0]);
//     /* https://stackoverflow.com/a/74390975 */
//     const base64photo = await new Promise(function (res, rej) {
//         reader.onload = function(e) {
//             res(e.target.result);
//         }
//     });
//     let user = await fetch('/query-current-user', {
//         method: 'GET',
//         headers: { 'Content-Length': 0 },
//     });
    
//     const user_json = await user.json();
//     const profile_change = await fetch('/query-modify-user', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', },
//         body: JSON.stringify({
//             email: JSON.parse(user_json.user).settings.email,
//             matchjson: JSON.stringify({}),
//             updjson: JSON.stringify({ 'settings.photo': base64photo }),
//         }),
//     });
//     //prototype to data validation
//     if (profile_change.status === 413) {
//         console.log('Picture size exceeds 5mb limit');
//     }
//     user = await fetch('/query-current-user', {
//         method: 'GET',
//         headers: { 'Content-Type': 0 },
//     })
//     const new_pfp_json = await user.json();
//     const new_pfp_user = JSON.parse(new_pfp_json.user);
//     const new_photo = new_pfp_user.settings.photo;
//     profilePic.src = new_photo;
// });




    
     
// const submit_btn = document.getElementById('change-profile-submit-btn');
// const profile_desc = document.getElementById('profile-description');
// const profile_name = document.getElementById('profile-name');

// const textbox_change_profile_desc = document.getElementById('change-desc');
// const inputbox_change_profile_name = document.getElementById('change-username');

// submit_btn.addEventListener('click', (e) =>{
//     profile_desc.innerHTML = textbox_change_profile_desc.value;
//     profile_name.innerHTML= inputbox_change_profile_name.value;
// });