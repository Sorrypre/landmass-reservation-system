async function sleep(ms) {
return new Promise(function(e) {
    setTimeout(e, ms);
});
}
function getNextSiblingOf(elem, css_selector) {
let sibling = elem.nextElementSibling;
//Find sibling div
while (sibling) {
    if(sibling.matches(css_selector))
    return sibling;
    else sibling = sibling.nextElementSibling;
}
return null;
}

const collapsibles = document.getElementsByClassName('collapsible-settings-button');
if (collapsibles) {
let i;
for(i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener('click', async function(e) {
    if (e.target.hasAttribute('disabled'))
        return;
    e.target.setAttribute('disabled', '');
    const nextSiblingOfTarget = getNextSiblingOf(e.target.closest('.collapsible-header-content'), '.collapsible-target-div');
    const collapseIcon = getNextSiblingOf(e.target, '.collapsible-plus-icon');
    if(!nextSiblingOfTarget)
        return;
    if(!nextSiblingOfTarget.matches('.collapsed')){
        nextSiblingOfTarget.style['height'] = nextSiblingOfTarget.scrollHeight + 'px';
        await sleep(150);
    }
    nextSiblingOfTarget.style['height'] = nextSiblingOfTarget.matches('.collapsed') ? nextSiblingOfTarget.scrollHeight + 'px' : '0';
    nextSiblingOfTarget.classList.toggle('collapsed');
    nextSiblingOfTarget.addEventListener('transitionend', setHeightAuto, {once: true});
    function setHeightAuto(){
        if(!nextSiblingOfTarget.matches('.collapsed')){
        nextSiblingOfTarget.style['height'] = 'auto';
        }
    }
    collapseIcon.classList.toggle('collapsed');
    if(nextSiblingOfTarget.matches('.collapsed')){
        close_dialog('profile-info-reset-warning')
        await sleep(500);
    }
    nextSiblingOfTarget.previousElementSibling.classList.toggle('collapsed');
    e.target.removeAttribute('disabled');
    });
}
}