const DIALOG_ID_PREFIX = 'mlcndlg-';
const PREFIX_CLOSE_BUTTON = '\u{20603}'; /* Chu Nom of Vietnamese 'đóng' (to seal shut) */
const PREFIX_DIALOG_MESSAGE = '\u{20D0D}'; /* Chu Nom of Vietnamese 'nhắn' (to leave a message) */
const PREFIX_DIALOG_RESPONSES = '\u{20CD2}'; /* Chu Nom of Vietnamese 'lời' (word; response) */
const ESCAPED_COMMA = '\u{22EB9}'; /* Chu Nom form of Vietnamese 'chia' (to separate) */
let with_dialog_targets = null;
refresh_dialog_targets();

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
		if (button_handler)
			button_handler.addEventListener('click', function(e) { open_dialog(dialog_name); });
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
	with_dialog_targets = document.querySelectorAll('button[target-dialog-id]:not([target-dialog-id=""])');
	for (let i = 0; i < with_dialog_targets.length; i++) {
		/* async event listener kung sakaling mangailangan in the future */
		with_dialog_targets[i].addEventListener('click', dialog_target_handler);
	}
}

function dialog_target_handler(e) {
	/* parehong required ang target-dialog-id target-dialog-command(s) sa button */
	const target = e.target.getAttribute('target-dialog-id');
	const command = e.target.getAttribute('target-dialog-command');
	const command_multi = e.target.getAttribute('target-dialog-commands');
	if (whitespaced(target))
		return; /* bawal space */
	if (!command && !command_multi)
		return;
	if (command_multi) {
		/*	for some psychos na gusto maglagay ng comma sa id, kunsino ka man,
			you have to escape the comma with \, sa multi-command */
		/*	replaced escaped commas temporarily with special character */
		const command_set = command_multi.toLowerCase().replace('\\,', ESCAPED_COMMA).split(',');
		for (const s of command_set)
			/* return comma bago iexecute */
			exec(target, s.replace(ESCAPED_COMMA, ','));
	} else if (command) {
		exec(target, command);
	}
}

function exec(target, command) {
	const lc_command = command.toLowerCase();
	if (lc_command === 'open')
		open_dialog(target);
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
	else if (lc_command === 'close')
		close_dialog(target);
	else if (lc_command === 'closedel') {
		close_dialog(target);
		document.getElementById(DIALOG_ID_PREFIX + '' + target).remove();
	}
	/* add more else ifs dito if need pa ng ibang custom commands */
}

function open_dialog(target) {
	if (whitespaced(target))
		return false;
	const target_dialog = document.getElementById(DIALOG_ID_PREFIX + '' + target);
	if (target_dialog && target_dialog.classList.contains('closed'))
		target_dialog.classList.toggle('closed');
	else
		return false;
	return true;
}

function close_dialog(target) {
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
	if (typeof str !== 'string' || str.trim().length < 1)
		return false;
	return /\s/.test(str.trim());
}