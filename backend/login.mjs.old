import express from 'express';

const xj = express();
const xjr = express.Router();

xjr.post('/lu', (q, r) => {
	const lu = q.body['login-username'];
	const lp = q.body['login-password'];
	/*console.log('login attempted: ' + lu + ' ' + lp);*/
	r.redirect('/frontend/pages/dashboard.html');
});

xjr.post('/ru', (q, r) => {
	const ru = q.body['register-username'];
	const rp = q.body['register-password'];
	const rc = q.body['register-confirm-password'];
	if (rp !== rc)
		r.json({
			success: false,
			message: 'password not confirmed'
		});
	else
		r.send('under construction');
});

export default xjr;