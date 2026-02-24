const generate_sample_dialog = function() {
	const msg = `
		<!-- https://uxwing.com/warning-icon/ -->
		<svg class="page-dialog-icon" id="warning" data-name="warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.54">
			<defs>
				<style>
					.cls-1{fill:#cf1f25;}
					.cls-2{fill:#fec901;fill-rule:evenodd;}
					.cls-3{fill:#010101;}
				</style>
			</defs>
			<title>warning</title>
			<path class="cls-1" d="M2.35,84.42,45.28,10.2l.17-.27h0A23,23,0,0,1,52.5,2.69,17,17,0,0,1,61.57,0a16.7,16.7,0,0,1,9.11,2.69,22.79,22.79,0,0,1,7,7.26q.19.32.36.63l42.23,73.34.24.44h0a22.48,22.48,0,0,1,2.37,10.19,17.63,17.63,0,0,1-2.17,8.35,15.94,15.94,0,0,1-6.93,6.6c-.19.1-.39.18-.58.26a21.19,21.19,0,0,1-9.11,1.75v0H17.61c-.22,0-.44,0-.65,0a18.07,18.07,0,0,1-6.2-1.15A16.42,16.42,0,0,1,3,104.24a17.53,17.53,0,0,1-3-9.57,23,23,0,0,1,1.57-8.74,7.66,7.66,0,0,1,.77-1.51Z"/>
			<path class="cls-2" d="M9,88.75,52.12,14.16c5.24-8.25,13.54-8.46,18.87,0l42.43,73.69c3.39,6.81,1.71,16-9.33,15.77H17.61C10.35,103.8,5.67,97.43,9,88.75Z"/>
			<path class="cls-3" d="M57.57,83.78A5.53,5.53,0,0,1,61,82.2a5.6,5.6,0,0,1,2.4.36,5.7,5.7,0,0,1,2,1.3,5.56,5.56,0,0,1,1.54,5,6.23,6.23,0,0,1-.42,1.35,5.57,5.57,0,0,1-5.22,3.26,5.72,5.72,0,0,1-2.27-.53A5.51,5.51,0,0,1,56.28,90a5.18,5.18,0,0,1-.36-1.27,5.83,5.83,0,0,1-.06-1.31h0a6.53,6.53,0,0,1,.57-2,4.7,4.7,0,0,1,1.14-1.56Zm8.15-10.24c-.19,4.79-8.31,4.8-8.49,0-.82-8.21-2.92-29.34-2.86-37.05.07-2.38,2-3.79,4.56-4.33a12.83,12.83,0,0,1,5,0c2.61.56,4.65,2,4.65,4.44v.24L65.72,73.54Z"/>
		</svg>
		<!-- https://uxwing.com/warning-icon/ -->
		<p class="pd-text-preset">Suspendisse sed maximus neque. Vivamus sodales dictum aliquet.</p>
	`;
	const res = `
		<button type="button" target-dialog-command="close" target-dialog-id="sample-dialog" class="page-dialog-message-button after:content-['OK']"></button>
	`;
	make_dialog('dialog-test-content', 'show-sample-dialog', 'sample-dialog', 'typical', 'Hello World!', false, false, msg, res);
};
const generate_sample_form = function() {
	const msg = `
		<form id="mlcndlg-sample-fillup-form-personal-info" name="personal-info" action="#" method="POST">
			<span class="form-section-title">PERSONAL DETAILS</span>
			<div class="form-section-row">
				<div class="form-section-item">
					<label for="user-lastname" class="after:content-['LAST_NAME']"></label>
					<input name="user-lastname">
				</div>
				<div class="form-section-item">
					<label for="user-firstname" class="after:content-['FIRST_NAME']"></label>
					<input name="user-firstname">
				</div>
				<div class="form-section-item">
					<label for="user-middlename" class="after:content-['MIDDLE_NAME']"></label>
					<input name="user-middlename">
				</div>
			</div>
			<div class="form-section-row">
				<div class="form-section-item">
					<label for="user-birthdate" class="after:content-['BIRTHDATE']"></label>
					<input type="date" name="user-birthdate">
				</div>
				<div class="form-section-item">
					<label for="user-gender" class="after:content-['SEX_AT_BIRTH']"></label>
					<div class="flex justify-start items-start">
						<div class="flex-1 flex gap-x-2">
							<input type="radio" name="user-gender" id="user-gender-male">
							<label for="user-gender-male" class="after:content-['Male'] content-start"></label>
						</div>
						<div class="flex-1 flex gap-x-2">
							<input type="radio" name="user-gender" id="user-gender-female">
							<label for="user-gender-female" class="after:content-['Female'] content-start"></label>
						</div>
						<div class="flex-2 flex gap-x-2">
							<input type="radio" name="user-gender" id="user-gender-none">
							<label for="user-gender-none" class="after:content-['Prefer_not_to_say'] content-start"></label>
						</div>
					</div>
				</div>
			</div>
			<div class="form-section-row">
				<div class="form-section-item">
					<label for="user-address-line-1" class="after:content-['ADDRESS_LINE_1']"></label>
					<input name="user-address-line-1">
				</div>
			</div>
			<div class="form-section-row">
				<div class="form-section-item">
					<div class="flex gap-x-4">
						<label for="user-address-line-2" class="after:content-['ADDRESS_LINE_2']"></label>
						<div class="flex gap-x-2">
							<input type="checkbox" name="user-address-line-2-set1">
							<label for="user-address-line-2-set1" class="after:content-['Same_as_Address_Line_1']"></label>
						</div>
					</div>
					<input name="user-address-line-2">
				</div>
			</div>
		</form>
	`
	const res = '';
	const dialog = make_dialog('dialog-test-content', 'show-sample-fillup', 'sample-fillup', 'big', 'User fill-up', true, true, msg, res);
	dialog.classList.add('w-[1000px]');
	const personal_info_form = document.forms['personal-info'];
	const address_line_1 = personal_info_form.elements['user-address-line-1'];
	const address_line_2 = personal_info_form.elements['user-address-line-2'];
	const same_as_permanent = personal_info_form.elements['user-address-line-2-set1'];
	address_line_1.addEventListener('change', function(e) {
		e.target.value = e.target.value.trim();
		if (e.target.value.length > 0) {
			if (same_as_permanent.checked) {
				address_line_2.value = e.target.value;					
			} else if (e.target.value === address_line_2.value) {
				same_as_permanent.checked = true;
				address_line_2.disabled = true;
			}
		}
	});
	address_line_2.addEventListener('change', function(e) {
		e.target.value = e.target.value.trim();
		if (!same_as_permanent.checked && e.target.value === address_line_1.value) {
			same_as_permanent.checked = true;
			e.target.disabled = true;
		}
	});
	same_as_permanent.addEventListener('change', function(e) {
		if (address_line_1.value.length < 1) {
			e.target.checked = false;
			address_line_2.value = '';
			address_line_2.disabled = false;
			return;
		}
		if (e.target.checked) {
			address_line_2.value = address_line_1.value;
			address_line_2.disabled = true;
		} else {
			address_line_2.value = '';
			address_line_2.disabled = false;
		}
	});
};

generate_sample_dialog();
generate_sample_form();