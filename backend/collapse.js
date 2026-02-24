async function sleep(ms) {
	return new Promise(function(e) {
		setTimeout(e, ms);
	});
}

function nextSiblingOf(elem, css_match) {
	let sibling = elem.nextElementSibling;
	while (sibling)
		if (sibling.matches(css_match))
			return sibling;
		else
			sibling = sibling.nextElementSibling;
	return null;
}

const collapsibles = document.getElementsByClassName('collapsible-button');
if (collapsibles) {
	for (let i = 0; i < collapsibles.length; i++) {
		collapsibles[i].addEventListener('click', async function(e) {
			if (e.target.hasAttribute('disabled'))
				return;
			/* disable button during this time para di magooverlap ung request */
			e.target.setAttribute('disabled', '');
			/* nsot to get the target, nsoi to get the icon if meron */
			const nsot = nextSiblingOf(e.target.closest('.collapsible-header'), '.collapsible-target');
			const nsoi = nextSiblingOf(e.target, '.collapsible-fold-icon');
			/* does nothing pag walang nahanap na sibling */
			if (!nsot)
				return;
			/* detects na ang purpose nung click is to fold back the collapsible */
			if (!nsot.matches('.folded')) {
				/* return from auto to scrollHeight since magfofold na ung collapsible after the click */
				nsot.style['height'] = nsot.scrollHeight + 'px';
				/* give time to calculate kaya may thread suspension dito */
				await sleep(150);
			}
			/*	kung nakafold, sets it from 0 to scrollHeight
				pero kung magfofold pa lang, sets from scrollHeight (handled ng if-block) to 0 */
			nsot.style['height'] = nsot.matches('.folded') ? nsot.scrollHeight + 'px' : '0';
			nsot.classList.toggle('folded');
			nsot.addEventListener('transitionend', function() {
				/*	this happens after expanding
					after nya ianimate ung expansion to scrollHeight,
					set height to auto pagkatapos ng animation para scalable sya across screen sizes */
				if (!nsot.matches('.folded'))
					nsot.style['height'] = 'auto';
			}, { once: true });
			/* toggle the icon if meron lang */
			if (nsoi)
				nsoi.classList.toggle('folded');
			/* enable back the button */
			e.target.removeAttribute('disabled');
		});
	}
}
