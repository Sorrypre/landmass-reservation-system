const crypto = require('crypto');
require('dotenv').config({ quiet: true });

const DEFAULT_SALT_BYTES = parseInt(process.env.DEFAULT_SALT_BYTES, 10);
const DEFAULT_PBKDF2_ITERATIONS = parseInt(process.env.DEFAULT_PBKDF2_ITERATIONS, 10);
const H512_KEYSIZE = parseInt(process.env.H512_KEYSIZE, 10);
const REGEX_HEXADECIMAL = process.env.REGEX_HEXADECIMAL;

async function getip() {
	const url = 'https://api.ipify.org/?format=json';
	try {
		const res = await fetch(url);
		if (!res.ok)
			throw new Error('Error: ipify responded with ' + res.status);
		const out = await res.json();
		return out['ip'];
	} catch (e) {
		console.error(e.stack);
	}
}
 
function getsalt(len) {
	if (Number.isInteger(len) && len >= 16 && (len & 15) === 0)
		return crypto.randomBytes(len);
	throw new Error('getsalt: invalid length (got ' + len + ')');
}

function h512(str, salt) {
	return new Promise(function(res, rej) {
		if (typeof str !== 'string' || str.length < 1)
			return rej(new Error('h512: str must be of type \'string\' and of non-zero length'));
		if (typeof salt !== 'string' && salt != null)
			return rej(new Error('h512: salt param type mismatch'));
		if (typeof salt === 'string' && (salt.length !== DEFAULT_SALT_BYTES * 2 || !REGEX_HEXADECIMAL.test(salt)))
			return rej(new Error('h512: specified salt must be of type \'string\' containing a ' + process.env.DEFAULT_SALT_BYTES + '-byte hex sequence (got ' + salt.length + ' bytes)'));
		try {
			const s = salt == null ? getsalt(DEFAULT_SALT_BYTES) : Buffer.from(salt, 'hex');
			crypto.pbkdf2(str, s, DEFAULT_PBKDF2_ITERATIONS, H512_KEYSIZE, 'sha512', function(e, h) {
				return e ? rej(e) : res({
					hashed: h.toString('hex'),
					salt: s.toString('hex'),
				});
			});
		} catch (e) {
			return rej(e);
		}
	});
}

async function cmph512(hash, str, salt) {
	try {
		const bufgiven = Buffer.from(hash, 'hex');
		const bufhashed = Buffer.from((await h512(str, salt)).hashed, 'hex');
		return bufgiven.length === bufhashed.length
			? crypto.timingSafeEqual(bufgiven, bufhashed)
			: false;
	} catch (e) {
		return false;
	}
}

module.exports.getip = getip;
module.exports.getsalt = getsalt;
module.exports.h512 = h512;
module.exports.cmph512 = cmph512;
