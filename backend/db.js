const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

const uri = process.env.MDB_URI_SRV;

const User = mongoose.Schema({
	admin: {
		type: Boolean,
		default: false,
	},
	hash: {
		type: String,
		required: true,
	},
	salt: {
		type: String,
		required: true,
	},
	reservations: [{
		building: String,
		room: String,
		datetime: Date,
		seats: [ Number ],
	}],
	settings: {
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		photo: {
			type: String,
			default: '',
		},
		bio: {
			type: String,
			default: '',
		}
	},
});

async function connect() {
	await mongoose.connect(uri);
	return true;
}

module.exports.User = mongoose.model('User', User);
module.exports.connect = connect;
