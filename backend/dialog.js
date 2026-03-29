const DIALOG_ID_PREFIX = 'mlcndlg-';
const PREFIX_CLOSE_BUTTON = '\u{20603}'; /* Chu Nom of Vietnamese 'đóng' (to seal shut) */
const PREFIX_DIALOG_MESSAGE = '\u{20D0D}'; /* Chu Nom of Vietnamese 'nhắn' (to leave a message) */
const PREFIX_DIALOG_RESPONSES = '\u{20CD2}'; /* Chu Nom of Vietnamese 'lời' (word; response) */
const ESCAPED_COMMA = '\u{22EB9}'; /* Chu Nom form of Vietnamese 'chia' (to separate) */
let with_dialog_targets = null;
refresh_dialog_targets();

// util func
function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

function make_dialog(parent_id, button_handler_id_if_any, dialog_name, dialog_size, dialog_title, is_content_flex_col, is_content_nogap, content_html, responses_html) {
	if (typeof parent_id !== 'string' || typeof button_handler_id_if_any !== 'string' ||
		typeof dialog_name !== 'string' || typeof dialog_size !== 'string' ||
		typeof is_content_flex_col !== 'boolean' || typeof is_content_nogap !== 'boolean' || 
		typeof content_html !== 'string' || typeof responses_html !== 'string') {
		console.error('make_dialog: Invalid parameter set');
		return;
	}
	const containing_parent = document.getElementById(parent_id);
	if (!containing_parent) {
		console.error('make_dialog: Parent does not exist');
		return;
	}
	if (document.getElementById(DIALOG_ID_PREFIX + '' + dialog_name)) {
		console.error('make_dialog: ' + dialog_name + ' already exists');
		return;
	}
	const dialog_sizes = ['typical', 'big', 'bigger', 'xbig'];
	if (!dialog_sizes.includes(dialog_size)) {
		console.error('make_dialog: Invalid dialog size; should be one of the following: ' + dialog_sizes.join(','));
		return;
	}
	const suffix_vertical = is_content_flex_col ? '-vertical' : '';
	const suffix_nogap = is_content_nogap ? '-nogap' : '';
	const template = `
		<div id="${DIALOG_ID_PREFIX}${dialog_name}" class="closed page-dialog pd-size-${dialog_size}">
			<div class="page-dialog-header">
				<a class="page-dialog-header-title">${dialog_title}</a>
				<button type="button" id="${PREFIX_CLOSE_BUTTON}${dialog_name}" class="page-dialog-header-close"></button>
			</div>
			<hr class="page-dialog-divider">
			<div class="page-dialog-content">
				<div id="${PREFIX_DIALOG_MESSAGE}${dialog_name}" class="page-dialog-message${suffix_vertical}${suffix_nogap}">
					<!--	pinakalaman talaga ng dialog nyo
							technically kung ayaw nyong gamitin ung responses_html
							and gusto nyo pa ring ilagay sa content_html ung buttons 
							okay lang din naman kayo bahala HAHAHAHA -->
					<!-- content_html -->
				</div>
				<div id="${PREFIX_DIALOG_RESPONSES}${dialog_name}" class="page-dialog-responses">
					<!--	kunsakaling may mga buttons kayo sa ilalim ng content, parang typical dialog box,
							pwede nyo syang ilagay sa responses_html parameter nyo -->
					<!-- responses_html -->
				</div>
			</div>
		</div>
	`;
	containing_parent.insertAdjacentHTML('beforeend', template);
	const close_button = document.getElementById(PREFIX_CLOSE_BUTTON + '' + dialog_name);
	const dialog_msg = dialog_message(dialog_name);
	const dialog_res = dialog_responses(dialog_name);
	dialog_msg.insertAdjacentHTML('beforeend', content_html);
	dialog_res.insertAdjacentHTML('beforeend', responses_html);
	close_button.addEventListener('click', function(e) { close_dialog(dialog_name); });
	if (button_handler_id_if_any != null && !whitespaced(button_handler_id_if_any) && button_handler_id_if_any.trim().length > 0) {
		const button_handler = document.getElementById(button_handler_id_if_any);
		if (button_handler) {
			button_handler.addEventListener('click', function(e) { 
				open_dialog(dialog_name); 
				playAlert();
			});
		}
		else
			console.warn('make_dialog: Ignored provided parameter "button_handler_id_if_any"; '+
				'button handler with the given ID does not exist');
	} else {
		console.warn('make_dialog: Ignored provided parameter "button_handler_id_if_any"; ' + 
			'no assigned button handler or given button handler ID is invalid');
	}
	refresh_dialog_targets();
	return document.getElementById(DIALOG_ID_PREFIX + '' + dialog_name);
}

async function make_dialog_v2(parent_id, dialog_name, dialog_size, dialog_title, is_content_flex_col, is_content_nogap, html_content, json_responses) {
	if (typeof parent_id !== 'string' || typeof dialog_name !== 'string' || typeof dialog_size !== 'string' ||
		typeof dialog_title !== 'string' || typeof is_content_flex_col !== 'boolean' || typeof is_content_nogap !== 'boolean' || 
		typeof html_content !== 'string' || !(json_responses !== null && typeof json_responses === 'object')) {
		console.error('make_dialog_v2: Invalid parameter set');
		return false;
	}
	if (document.getElementById(DIALOG_ID_PREFIX + '' + dialog_name)) {
		console.error('make_dialog_v2: ' + dialog_name + ' already exists');
		return false;
	}
	const containing_parent = document.getElementById(parent_id);
	if (!containing_parent) {
		console.error('make_dialog_v2: Parent does not exist');
		return false;
	}
	const dialog_sizes = ['typical', 'big', 'bigger', 'xbig'];
	if (!dialog_sizes.includes(dialog_size)) {
		console.error('make_dialog: Invalid dialog size; should be one of the following: ' + dialog_sizes.join(','));
		return false;
	}
	const make_dialog_response = await fetch('/make-dialog', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', },
		body: JSON.stringify({
			dialogs: [{
				name: dialog_name,
				title: dialog_title,
				size: dialog_size,
				vertical: is_content_flex_col,
				nogap: is_content_nogap,
				html_content: html_content,
				responses: json_responses,
			}],
		}),
	});
	const make_dialog_json = await make_dialog_response.json();
	if (!make_dialog_response.ok && !make_dialog_json.success) {
		console.error(make_dialog_json.error);
		return false;
	}
	const html = make_dialog_json.html;
	containing_parent.insertAdjacentHTML('beforeend', html);
	refresh_dialog_targets();
	return true;
}

async function make_dialogs_v2(...make_dialog_v2_params) {
	let func_result = true;
	let group_by_parent = new Map();
	/* Foolproofing + group dialogs to their respective parent */
	for (let i = 0; i < make_dialog_v2_params.length; i++) {
		const set = make_dialog_v2_params[i];
		if (typeof set.parent_id !== 'string' || typeof set.dialog_name !== 'string' || typeof set.dialog_size !== 'string' ||
			typeof set.dialog_title !== 'string' || typeof set.is_content_flex_col !== 'boolean' || typeof set.is_content_nogap !== 'boolean' || 
			typeof set.html_content !== 'string' || typeof set.json_responses === 'object') {
			console.error('make_dialogs_v2: parameter set ' + (i + 1) + ' is invalid');
			return false;
		}
		if (whitespaced(set.parent_id) || whitespaced(set.dialog_name) || !document.getElementById(set.parent_id) ||
			document.getElementById(DIALOG_ID_PREFIX + '' + set.dialog_name) || set.json_responses === null) {
			console.error('make_dialogs_v2: parameter set ' + (i + 1) + ' is invalid');
			return false;	
		}
		if (group_by_parent.has(set.parent_id)) {
			group_by_parent.get(set.parent_id).push(set);
		} else {
			group_by_parent.set(set.parent_id, [set]);
		}
	}
	/* Create the dialogs and append resulting HTML to the respective parent */
	for (const [k, v] of group_by_parent) {
		let dialogs = [];
		for (const set of v) {
			dialogs.push({
				name: set.dialog_name,
				title: set.dialog_title,
				size: set.dialog_size,
				vertical: set.is_content_flex_col,
				nogap: set.is_content_nogap,
				html_content: set.html_content,
				responses: set.json_responses,
			});
		}
		const make_dialog_response = await fetch('/make-dialog', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				dialogs: dialogs,
			}),
		});
		const make_dialog_json = await make_dialog_response.json();
		if (!make_dialog_response.ok && !make_dialog_json.success) {
			func_result = false;
			console.warn('make_dialogs_v2: unable to create dialogs for parent ' + k + ', please recheck your parameter sets assigned to this parent');
			continue;
		}
		const html = make_dialog_json.html;
		const containing_parent = document.getElementById(k);
		if (!containing_parent) {
			func_result = false;
			console.warn('make_dialogs_v2: unable to append created dialogs for parent ' + k + ' as it no longer exists by the time of appending');
			continue;
		}
		containing_parent.insertAdjacentHTML('beforeend', html);
	}
	refresh_dialog_targets();
	return func_result;
}

function dialog_message(dialog_name) {
	if (typeof dialog_name !== 'string' || dialog_name.length < 1)
		return null;
	return document.getElementById(PREFIX_DIALOG_MESSAGE + '' + dialog_name);
}

function dialog_responses(dialog_name) {
	if (typeof dialog_name !== 'string' || dialog_name.length < 1)
		return null;
	return document.getElementById(PREFIX_DIALOG_RESPONSES + '' + dialog_name);
}

function refresh_dialog_targets() {
	if (with_dialog_targets && with_dialog_targets.length > 0)
		for (const b of with_dialog_targets)
			b.removeEventListener('click', dialog_target_handler);
	with_dialog_targets = document.querySelectorAll(
		'button[target-dialog-id]:not([target-dialog-id=""]),' +
		'button[target-dialog-ids]:not([target-dialog-ids=""])'
	);
	for (let i = 0; i < with_dialog_targets.length; i++)
		/* async event listener kung sakaling mangailangan in the future */
		with_dialog_targets[i].addEventListener('click', dialog_target_handler);
}

function dialog_target_handler(e) {
	/* parehong required ang target-dialog-id(s) target-dialog-command(s) sa button */
	const target = e.target.getAttribute('target-dialog-id');
	const target_multi = e.target.getAttribute('target-dialog-ids');
	const command = e.target.getAttribute('target-dialog-command');
	const command_multi = e.target.getAttribute('target-dialog-commands');
	if (whitespaced(target) || whitespaced(target_multi))
		return;
	if (!target && !target_multi)
		return;
	if (!command && !command_multi)
		return;
	if (target_multi && !command_multi)
		return;
	const params_attrib = e.target.getAttribute('target-dialog-command-params');
	const command_params = params_attrib ? JSON.parse(params_attrib.replaceAll('\\"', '"')) : null;
	if (command_multi) {
		/*	for some psychos na gusto maglagay ng comma sa id, kunsino ka man,
			you have to escape the comma with \, sa multi-command */
		/*	replaced escaped commas temporarily with special character */
		const command_set = command_multi.replace('\\,', ESCAPED_COMMA).split(',');
		if (target_multi) {
			const target_set = target_multi.replace('\\,', ESCAPED_COMMA).split(',');
			for (let i = 0; i < target_set.length && i < command_set.length; i++)
				/* return comma bago iexecute */
				exec(target_set[i].replace(ESCAPED_COMMA, ','), command_set[i].replace(ESCAPED_COMMA, ','), command_params[i] ?? []);
		} else {
			for (let i = 0; i < command_set.length; i++)
				exec(target, s.replace(ESCAPED_COMMA, ','), command_params[i] ?? []);
		}
	} else if (command) {
		exec(target, command);
	}
}

async function exec(target, command, params) {
	const lc_command = command.toLowerCase();
	if (lc_command === 'open') {
		open_dialog(target);
	}
	else if (lc_command.startsWith('form-clear@') && lc_command.length > 'form-clear@'.length) {
		/*	when getting the target form, gamitin ulit ung command instead of lc_command
			para case-insensitive na sya ulit */
		const target_form = command.substring(command.indexOf('@') + 1);
		clear_form(target, target_form);
	}
	else if (lc_command.startsWith('form-submit@') && lc_command.length > 'form-submit@'.length) {
		const target_form = command.substring(command.indexOf('@') + 1);
		submit_form(target, target_form);
	}
	else if (lc_command === 'close') {
		close_dialog(target);
	}
	else if (lc_command === 'closedel') {
		close_dialog(target);
		await sleep(150);
		document.getElementById(DIALOG_ID_PREFIX + '' + target).remove();
	}
	else if (lc_command.startsWith('func@') && lc_command.length > 'func@'.length) {
		const target_func = command.substring(command.indexOf('@') + 1);
		await window[target_func](...params);
	}
	/* add more else ifs dito if need pa ng ibang custom commands */
}

async function open_dialog(target) {
	await sleep(150);	
	if (whitespaced(target))
		return false;
	const target_dialog = document.getElementById(DIALOG_ID_PREFIX + '' + target);
	if (target_dialog && target_dialog.classList.contains('closed'))
		target_dialog.classList.toggle('closed');
	else
		return false;
	return true;
}

async function close_dialog(target) {
	if (whitespaced(target))
		return false;
	const target_dialog = document.getElementById(DIALOG_ID_PREFIX + '' + target);
	if (target_dialog && !target_dialog.classList.contains('closed'))
		target_dialog.classList.toggle('closed');
	else
		return false;
	return true;
}

function clear_form(target, target_form) {
	if (whitespaced(target) || whitespaced(target_form))
		return false;
	const target_dialog = document.getElementById(DIALOG_ID_PREFIX + '' + target);
	if (!target_dialog)
		return false;
	const _target_form = document.getElementById(DIALOG_ID_PREFIX + '' + target + '-form-' + target_form);
	if (_target_form)
		_target_form.reset();
	else
		return false;
	return true;
}

function whitespaced(str) {
	if (typeof str !== 'string')
		return false;
	return /\s/.test(str);
}

/* USER-DEFINED COMMANDS */
function sendConsoleLog(msg) {
	console.log(msg);
}

