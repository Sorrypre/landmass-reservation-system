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