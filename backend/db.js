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
			seats: [ Number ],
		},
	}],
	settings: {
		online: {
			type: Boolean,
			default: false,
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

async function modifyUser(email, matchjson, setjson, deljson) {
	return (await User.updateMany({
		'settings.email': email,
		...matchjson,
	}, {
		$set: { ...setjson, },
		$unset: { ...deljson, },
	}, { runValidators: true })).modifiedCount;
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
	const u = await getUser(email, {});
	if (!u)
		return -1; /* user not found in db */
	const access = await session.cmph512(u.hash, password, u.salt);
	return access ? 1 : 0;
}

async function getReservations(email) {
	const u = await getUser(email, {});
	if (!u)
		return [];

	return u.reservations.map (r => ({
		dt_request: r.dt_request,
		requestor: r.details.requestor,
		building: r.details.building,
		room: r.details.room,
		startTime: r.details.startTime,
		endTime: r.details.endTime,
		seats: r.details.seats,
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

module.exports.connect = connect;
module.exports.instance = instance;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.setUser = modifyUser;
module.exports.register = register;
module.exports.login = login;
module.exports.getReservations = getReservations;
module.exports.addReservations = addReservations;