// util func
function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

// elements
const btn_login = document.getElementById('login-submit-login');
const btn_create = document.getElementById('register-new-user');
const btn_reg = document.getElementById('login-register');
const btn_ret_login = document.getElementById('register-cancel');
const ctr_form = document.getElementById('index-forms');
const form_reg = document.getElementById('register');
const form_login = document.getElementById('login');

// input boxes
const form_inp_lusr = form_login.elements.namedItem('login-email');
const form_inp_lpwd = form_login.elements.namedItem('login-password');
const form_inp_rusr = form_reg.elements.namedItem('register-email');
const form_inp_rpwd = form_reg.elements.namedItem('register-password');
const form_inp_rcfm = form_reg.elements.namedItem('register-confirm-password');
// status labels
const lbl_lusr = document.getElementById('login-email-status');
const lbl_lpwd = document.getElementById('login-password-status');
const lbl_rusr = document.getElementById('register-email-status');
const lbl_rpwd = document.getElementById('register-password-status');
const lbl_rcfm = document.getElementById('register-confirm-status');

// prereqs
const rxe = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
const pwd_min = 8;

// dialog templates

// making failure dialogs using old make_dialog
const make_failure_dialog = function(id, title, message) {
	if (typeof id !== 'string' || typeof title !== 'string' || typeof message !== 'string')
		throw new Error('login system: invalid failure dialog parameters passed');
	const responses_html = `
		<button type="button", target-dialog-command="closedel" target-dialog-id="${id}" class="page-dialog-message-button after:content-['OK']"></button>
	`;
	const content_html = `
		<!-- https://www.iconpacks.net/free-icon/error-10376.html -->
		<svg class="page-dialog-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 256" xml:space="preserve">
			<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
				<path d="M 28.5 65.5 c -1.024 0 -2.047 -0.391 -2.829 -1.172 c -1.562 -1.562 -1.562 -4.095 0 -5.656 l 33 -33 c 1.561 -1.562 4.096 -1.562 5.656 0 c 1.563 1.563 1.563 4.095 0 5.657 l -33 33 C 30.547 65.109 29.524 65.5 28.5 65.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
				<path d="M 61.5 65.5 c -1.023 0 -2.048 -0.391 -2.828 -1.172 l -33 -33 c -1.562 -1.563 -1.562 -4.095 0 -5.657 c 1.563 -1.562 4.095 -1.562 5.657 0 l 33 33 c 1.563 1.562 1.563 4.095 0 5.656 C 63.548 65.109 62.523 65.5 61.5 65.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
				<path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 8 C 24.598 8 8 24.598 8 45 c 0 20.402 16.598 37 37 37 c 20.402 0 37 -16.598 37 -37 C 82 24.598 65.402 8 45 8 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
			</g>
		</svg>
		<!-- https://www.iconpacks.net/free-icon/error-10376.html -->
		<p class="pd-text-preset">${message}</p>
	`;
	return make_dialog('index-content', '', id, 'typical', title, false, false, content_html, responses_html);
}

// make_dialog_v2
const failure_dialog = async function(parent_html_id, dialog_id, title, message, size = 'typical', flex_col = false, nogap = false) {
	if (typeof parent_html_id !== 'string' || typeof dialog_id !== 'string' || typeof message !== 'string' || typeof size !== 'string' ||
		typeof flex_col !== 'boolean' || typeof nogap !== 'boolean')
		throw new Error('login system: invalid failure dialog parameters passed');
	const html_content = `
		<!-- https://www.iconpacks.net/free-icon/error-10376.html -->
		<svg class="page-dialog-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 256" xml:space="preserve">
			<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
				<path d="M 28.5 65.5 c -1.024 0 -2.047 -0.391 -2.829 -1.172 c -1.562 -1.562 -1.562 -4.095 0 -5.656 l 33 -33 c 1.561 -1.562 4.096 -1.562 5.656 0 c 1.563 1.563 1.563 4.095 0 5.657 l -33 33 C 30.547 65.109 29.524 65.5 28.5 65.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
				<path d="M 61.5 65.5 c -1.023 0 -2.048 -0.391 -2.828 -1.172 l -33 -33 c -1.562 -1.563 -1.562 -4.095 0 -5.657 c 1.563 -1.562 4.095 -1.562 5.657 0 l 33 33 c 1.563 1.562 1.563 4.095 0 5.656 C 63.548 65.109 62.523 65.5 61.5 65.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
				<path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 8 C 24.598 8 8 24.598 8 45 c 0 20.402 16.598 37 37 37 c 20.402 0 37 -16.598 37 -37 C 82 24.598 65.402 8 45 8 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
			</g>
		</svg>
		<!-- https://www.iconpacks.net/free-icon/error-10376.html -->
		<p class="pd-text-preset">${message}</p>
	`;
	const json_responses = [{
		button_text: 'OK',
		commands: [{
			command: 'closedel',
			target: dialog_id,
			params: [],
		}, {
			command: 'func@sendConsoleLog',
			target: dialog_id,
			params: ['hello world, how are you doing today'],
		}],
	}]
	return make_dialog_v2(parent_html_id, dialog_id, size, title, flex_col, nogap, html_content, json_responses);
}

// handle login / create account
btn_login.addEventListener('click', function(e) {
	function alert_email(t) {
		switch (t) {
			case 0:
				lbl_lusr.classList.add('email-empty');
				break;
			case 1:
				lbl_lusr.classList.add('email-invalid');
				break;
			default:
				return false;
		}
		lbl_lusr.style['display'] = 'inline';
		void lbl_lusr.offsetWidth;
		return true;
	}
	
	function alert_password(t) {
		switch (t) {
			case 0:
				lbl_lpwd.classList.add('password-empty');
				break;
			case 1:
				lbl_lpwd.classList.add('password-short');
				break;
			default:
				return false;
		}
		lbl_lpwd.style['display'] = 'inline';
		void lbl_lpwd.offsetWidth;
		return true;
	}
	
	if (!form_inp_lusr || !form_inp_lpwd)
		return;
	if (form_inp_lusr.value.length > 0 && rxe.test(form_inp_lusr.value) && form_inp_lpwd.value.length >= pwd_min) {
		form_login.requestSubmit();
		return true;
	} else {
		if (form_inp_lusr.value.length === 0)
			alert_email(0);
		if (form_inp_lpwd.value.length === 0)
			alert_password(0);
		if (!rxe.test(form_inp_lusr.value))
			alert_email(1);
		if (form_inp_lpwd.value.length < pwd_min)
			alert_password(1);
		return false;
	}
});

btn_create.addEventListener('click', function(e) {
	function alert_email(t) {
		switch (t) {
			case 0:
				lbl_rusr.classList.add('email-empty');
				break;
			case 1:
				lbl_rusr.classList.add('email-invalid');
				break;
			default:
				return false;
		}
		lbl_rusr.style['display'] = 'inline';
		void lbl_rusr.offsetWidth;
		return true;
	}
	
	function alert_password(t) {
		switch (t) {
			case 0:
				lbl_rpwd.classList.add('password-empty');
				break;
			case 1:
				lbl_rpwd.classList.add('password-short');
				break;
			default:
				return false;
		}
		lbl_rpwd.style['display'] = 'inline';
		void lbl_rpwd.offsetWidth;
		return true;
	}
	
	function alert_confirm(t) {
		switch (t) {
			case 0:
				lbl_rcfm.classList.add('confirm-empty');
				break;
			case 1:
				lbl_rcfm.classList.add('confirm-mismatch');
				break;
			default:
				return false;
		}
		lbl_rcfm.style['display'] = 'inline';
		void lbl_rcfm.offsetWidth;
		return true;
	}
	
	if (!form_inp_rpwd || !form_inp_rcfm)
		return;
	if (form_inp_rusr.value.length > 0 && rxe.test(form_inp_rusr.value) && form_inp_rpwd.value.length >= pwd_min && form_inp_rpwd.value === form_inp_rcfm.value) {
		form_reg.requestSubmit();
		return true;
	} else {
		if (form_inp_rusr.value.length === 0)
			alert_email(0);
		if (form_inp_rpwd.value.length === 0)
			alert_password(0);
		if (form_inp_rcfm.value.length === 0)
			alert_confirm(0);
		if (!rxe.test(form_inp_rusr.value))
			alert_email(1);
		if (form_inp_rpwd.value.length < pwd_min)
			alert_password(1);
		if (form_inp_rpwd.value !== form_inp_rcfm.value)
			alert_confirm(1);
		return false;
	}
});

form_inp_lusr.addEventListener('input', function(e) {
	if (lbl_lusr.classList.length > 1) {
		lbl_lusr.className = 'login-invalid';
		void lbl_lusr.offsetWidth;
	}
});

form_inp_lpwd.addEventListener('input', function(e) {
	if (lbl_lpwd.classList.length > 1) {
		lbl_lpwd.className = 'login-invalid';
		void lbl_lpwd.offsetWidth;
	}
});

form_inp_rusr.addEventListener('input', function(e) {
	if (lbl_rusr.classList.length > 1) {
		lbl_rusr.className = 'register-invalid';
		void lbl_rusr.offsetWidth;
	}
});

form_inp_rpwd.addEventListener('input', function(e) {
	if (lbl_rpwd.classList.length > 1) {
		lbl_rpwd.className = 'register-invalid';
		void lbl_rpwd.offsetWidth;
	}
});

form_inp_rcfm.addEventListener('input', function(e) {
	if (lbl_rcfm.classList.length > 1) {
		lbl_rcfm.className = 'register-invalid';
		void lbl_rcfm.offsetWidth;
	}
});

// Fetch login
form_login.addEventListener('submit', async function(e) {
	e.preventDefault();
	btn_login.disabled = true;
	const email = form_inp_lusr.value;
	const password = form_inp_lpwd.value;
	try {
		const login = await fetch('/lu', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});
		const result = await login.json();
		if (login.ok) {
			/* login success */
			window.location.reload();
		} else {
			/* login failed */
			/*
			const failure_dialog_id = 'error-' + login.status + '-' + Date.now();
			make_failure_dialog(failure_dialog_id, 'Error ' + login.status, result.error);
			*/
			const failure_dialog_id = 'error-' + login.status + '-' + Date.now();
			const containing_parent = document.querySelector('div[id$="-content"]').getAttribute('id');
			failure_dialog(containing_parent, failure_dialog_id, 'Error: ' + login.status, result.error);
			open_dialog(failure_dialog_id);
		}
	} catch (e) {
		console.error('An error occurred while logging in. ' + e);
	}
	btn_login.disabled = false;
});

// Fetch register
form_reg.addEventListener('submit', async function(e) {
	e.preventDefault();
	btn_create.disabled = true;
	const email = form_inp_rusr.value;
	const password = form_inp_rpwd.value;
	try {
		const register = await fetch('/ru', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', },
			body: JSON.stringify({ email, password }),
		});
		const result = await register.json();
		if (register.ok) {
			/* registration success */
			/* registration dialog, pero for now reload muna */
			window.location.reload();
		} else {
			/* registration failed */
			const failure_dialog_id = 'error-' + register.status + '-' + Date.now();
			make_failure_dialog(failure_dialog_id, 'Error ' + register.status, result.error);
			await sleep(150);
			open_dialog(failure_dialog_id);
		}
	} catch (e) {
		console.error('An error occurred while registering.' + e);
	}
	btn_create.disabled = false;
});

// handle register / back to login
// must be strictly greater than duration for <form> transitions, see login.css
const delay = 300;

btn_reg.addEventListener('click', async function(e) {
	ctr_form.style['flex-direction'] = 'row-reverse';
	form_login.style['transform'] = 'translateX(80%)';
	form_login.style['display'] = 'none';
	form_login.style['opacity'] = '0.0';
	// wait for transition to finish
	await sleep(delay);
	form_reg.style['transform'] = 'translateX(80%)';
	form_reg.style['transform'] = 'none';
	form_reg.style['display'] = 'flex';
	form_reg.style['opacity'] = '1.0';
});

btn_ret_login.addEventListener('click', async function(e) {
	ctr_form.style['flex-direction'] = 'row';
	form_reg.style['transform'] = 'translateX(80%)';
	form_reg.style['display'] = 'none';
	form_reg.style['opacity'] = '0.0';
	// wait for transition to finish
	await sleep(delay);
	form_login.style['transform'] = 'translateX(80%)';
	form_login.style['transform'] = 'none';
	form_login.style['display'] = 'flex';
	form_login.style['opacity'] = '1.0';
});

console.log('start page');