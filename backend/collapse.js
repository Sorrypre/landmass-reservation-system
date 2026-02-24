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
			e.target.setAttribute('disabled', '');
			const nsot = nextSiblingOf(e.target.closest('.collapsible-header'), '.collapsible-target');
			const nsoi = nextSiblingOf(e.target, '.collapsible-fold-icon');
			console.log(nsot);
			if (!nsot)
				return;
			if (!nsot.matches('.folded')) {
				nsot.style['height'] = nsot.scrollHeight + 'px';
				await sleep(150);
				console.log('computed scroll height: ', nsot.scrollHeight);
			}
			nsot.style['height'] = nsot.matches('.folded') ? nsot.scrollHeight + 'px' : '0';
			nsot.classList.toggle('folded');
			nsot.addEventListener('transitionend', function() {
				if (!nsot.matches('.folded')) {
					nsot.style['height'] = 'auto';
					console.log('set to auto');
				}
			}, { once: true });
			nsoi.classList.toggle('folded');
			e.target.removeAttribute('disabled');
		});
	}
}
