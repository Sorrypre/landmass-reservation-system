const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const session = require('./session');
require('dotenv').config({ quiet: true });

let instance;
const uri = process.env.MDB_URI_SRV;

const schUser = new mongoose.Schema({
	admin: {
		type: Boolean,
		default: false,
	},
	hash: {
		type: String,
		minlength: 512,
		maxlength: 512,
		required: true,
	},
	salt: {
		type: String,
		minlength: 64,
		maxlength: 64,
		required: true,
	},
	reservations: [{
		dt_request: Date,
		details: {
			requestor: String,
			building: String,
			room: String,
			startTime: Date,
			endTime: Date,
			seat: Number,
		},
	}],
	settings: {
		isActive: {
			type: Boolean,
			default: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			minlength: 6,
			maxlength: 254,
			required: true,
			unique: true,
		},
		photo: {
			type: String,
			default: '',
		},
		bio: {
			type: String,
			maxlength: 160,
			default: 'This user has no bio.',
		},
	},
});
const User = mongoose.model('User', schUser);

async function dummyUsers(count) {
	if (!Number.isInteger(count))
		throw new Error('dummyUsers: invalid integer parameter \'count\'');
	let timesList = [
		"0730", "0800", "0830", "0900", "0930", 
		"1000", "1030", "1100", "1130", "1200", 
		"1230", "1300", "1330", "1400", "1430", 
		"1500", "1530", "1600", "1630", "1700"
	];
	let quotient = 0;
	for (let i = 0; i < count; i++) {
		const rand = Math.floor(Math.random() * 100000);
		const email = 'dummy.user' + rand + '@dummyusers.co';
		const try_user = await getUser(email, {});
		if (try_user !== null)
			continue;
		const user_hash = await session.h512('password' + rand, undefined);
		const user_register = await register(email, user_hash.hashed, user_hash.salt);
		if (user_register) {
			if (timesList.length < 2) {
				timesList = [
					"0730", "0800", "0830", "0900", "0930", 
					"1000", "1030", "1100", "1130", "1200", 
					"1230", "1300", "1330", "1400", "1430", 
					"1500", "1530", "1600", "1630", "1700"
				];
				quotient++;
			}
			const index = Math.floor(Math.random() * timesList.length);
			const time = (timesList[index].slice(0, 2) + ':' + timesList[index].slice(2)).split(':');
			let request_datetime = new Date();
			request_datetime.setDate(request_datetime.getDate() + 2 * quotient);
			let start_datetime = new Date();
			start_datetime.setDate(start_datetime.getDate() + 2 * quotient + 1);
			start_datetime.setHours(parseInt(time[0], 10) + 8, parseInt(time[1], 10), 0, 0);
			let end_datetime = new Date(start_datetime);
			end_datetime.setHours(end_datetime.getHours() + 2);
			const modify = await modifyUser(email, {}, {
				$push: {
					reservations: {
						dt_request: request_datetime,
						details: {
							building: 'Gokongwei',
							room: 'G204',
							startTime: start_datetime,
							endTime: end_datetime,
							seat: Math.floor(Math.random() * 29) + 1,
						}
					}
				}
			});
			if (modify > 0) {
				timesList.splice(index, 5);
				timesList.splice(Math.max(0, index - 4), 4);
			}
		}
	}
}

async function connect() {
	await mongoose.connect(uri);
	instance = new MongoClient(uri).db('main');
	return true;
}

async function getUsers(matchjson) {
	return await User.find({ ...matchjson, });
}

async function getUser(email, matchjson) {
	return await User.findOne({
		'settings.email': email,
		...matchjson,
	});
}

async function modifyUser(email, matchjson, updjson) {
	return (await User.updateMany({
		'settings.email': email,
		...matchjson,
	}, updjson, { runValidators: true })).modifiedCount;
}

async function register(email, hash, salt) {
	const u = new User({
		hash: hash,
		salt: salt,
		reservations: [],
		settings: {
			username: email.split('@')[0].substring(0, 8) + '-' + salt.substring(0, 5),
			email: email,
		}
	});
	try {
		await u.save();
		return true;
	} catch (e) {
		/*	MongoDB E11000: incoming duplicate on property with unique: true,
			as for the email, ibig sabihin meron na sa database pero sinusubukan pa rin ipasok
			https://www.mongodb.com/docs/manual/reference/error-codes/ */
		if (e.code === 11000)
			return false;
		throw new Error('db.register: unexpected error on registration');
	}
}

async function login(email, password) {
	const u = await getUser(email, { 'settings.isActive': true, });
	if (!u)
		return -1; /* user has been deleted or is not found in db */
	const access = await session.cmph512(u.hash, password, u.salt);
	return access ? 1 : 0;
}

async function getReservations(email) {
	const u = await getUser(email, {});
	if (!u)
		return [];

	return u.reservations.map (r => ({
		_id: r._id.toString(),
		dt_request: r.dt_request,
		requestor: r.details.requestor || 'Anonymous',
		building: r.details.building,
		room: r.details.room,
		startTime: r.details.startTime,
		endTime: r.details.endTime,
		seat: r.details.seat,
		user_email: u.settings.email,
	}));
}

async function addReservations(email, reservation){
	try {
		const result = await User.updateOne(
            { "settings.email": email }, 
            { $push: { reservations: reservation } }
        );
		return result.modifiedCount>0;
	} catch (e) {
		/*	MongoDB E11000: incoming duplicate on property with unique: true,
			as for the email, ibig sabihin meron na sa database pero sinusubukan pa rin ipasok
			https://www.mongodb.com/docs/manual/reference/error-codes/ */
		if (e.code === 11000)
			return false;
		throw new Error('db.register: unexpected error on registration');
  }
}
async function getAllReservations() {
	const allUsers = await getUsers({});
	const reservations = [];

	allUsers.forEach(u => {
		u.reservations.forEach(r => {
			reservations.push({
				_id: r._id.toString(),
				dt_request: r.dt_request,
				requestor: r.details.requestor || 'Anonymous',
				building: r.details.building,
				room: r.details.room,
				startTime: r.details.startTime,
				endTime: r.details.endTime,
				seat: r.details.seat,
				user_email: u.settings.email,
				username: u.settings.username,
			});
		});
	});

	return reservations;
}

async function getUserReservations(username) {
	const targetUser = await User.findOne({ 'settings.username': username });
	if (!targetUser) return [];

	return targetUser.reservations.map(r => ({
		_id: r._id.toString(),
		dt_request: r.dt_request,
		requestor: r.details.requestor || 'Anonymous',
		building: r.details.building,
		room: r.details.room,
		startTime: r.details.startTime,
		endTime: r.details.endTime,
		seat: r.details.seat,
		user_email: targetUser.settings.email,
		username: targetUser.settings.username,
	}));
}

function applyFilters(res, building, room, startTime, date) {
	if (building && res.building !== building) return false;
	if (room && res.room !== room) return false;

	if (startTime) {
		const filter_hour = parseInt(startTime.substring(0, 2));
		const filter_min = parseInt(startTime.substring(2, 4));
		const res_time = new Date(res.startTime);
		const res_hour = res_time.getHours();
		const res_min = res_time.getMinutes();

		//if reservation time, is less than the selected fiter time, then return false
		if (res_hour < filter_hour || (res_hour === filter_hour && res_min < filter_min))
			return false;
	}

	if (date) {
		const target_date = new Date(date);
		const next_date = new Date(target_date);
		next_date.setDate(next_date.getDate() + 1);
		const res_date = new Date(res.startTime);
		res_date.setHours(0, 0, 0, 0);
		target_date.setHours(0, 0, 0, 0);
		next_date.setHours(0, 0, 0, 0);
		if (res_date < target_date || res_date >= next_date) return false;
	}

	return true;
}

async function removeReservation(email, reservation_id) {
	try {
		console.log('Removing reservation:', { email, reservation_id });
		const id = new mongoose.Types.ObjectId(reservation_id);
		const result = await User.updateOne({
			'settings.email': email,
			'reservations._id': id
		}, {
			$pull: {
				reservations: {
					_id: id
				}
			}
		});
		console.log('Update result:', result);
		return result;
	}
	catch (e) {
		console.error('Error in removeReservation:', e);
		throw new Error('Invalid reservation ID format');
	}
}

module.exports.connect = connect;
module.exports.instance = instance;
module.exports.dummyUsers = dummyUsers;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.setUser = modifyUser;
module.exports.register = register;
module.exports.login = login;
module.exports.getReservations = getReservations;
module.exports.addReservations = addReservations;
module.exports.getAllReservations = getAllReservations;
module.exports.getUserReservations = getUserReservations;
module.exports.removeReservation = removeReservation;
module.exports.applyFilters = applyFilters;
