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
    alertAudio.src = '../assets/audio/alertSound.mp3';
    alertAudio.play();
}

let profilePic = document.getElementById('profilepic');
        const initialProfilePic = document.getElementById('profilepic-initial');
        const inputFile = document.getElementById("input-file-pfp");
        const pfp_submit_btn = document.getElementById('change-profilepic-confirm-btn');
        // let profileCancelBtn = document.getElementById('change-profilepic-cancel-btn');

        inputFile.onclick = function(){
        this.value = null;
        }
        inputFile.onchange = function(){
            initialProfilePic.src = URL.createObjectURL(inputFile.files[0]);
        }
        function cancelProfilePicChange(){
        initialProfilePic.src = profilePic.src;
        }
        pfp_submit_btn.addEventListener('click', async function confirmProfilePicChange() {
            const reader = new FileReader();
            const base64photo = reader.readAsDataURL(inputFile.files[0]);

            const user = await fetch('/query-current-user', {
                method: 'GET',
                headers: { 'Content-Length': 0 },
            });
            const profile_change = await fetch('/query-modify-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: {
                    email: user.settings.email,
                    matchjson: JSON.stringify({}),
                    updjson: JSON.stringify({ 'settings.photo': base64photo }),
                    }
            });

        })
// const submit_btn = document.getElementById('change-profile-submit-btn');
// const profile_desc = document.getElementById('profile-description');
// const profile_name = document.getElementById('profile-name');

// const textbox_change_profile_desc = document.getElementById('change-desc');
// const inputbox_change_profile_name = document.getElementById('change-username');

// submit_btn.addEventListener('click', (e) =>{
//     profile_desc.innerHTML = textbox_change_profile_desc.value;
//     profile_name.innerHTML= inputbox_change_profile_name.value;
// });