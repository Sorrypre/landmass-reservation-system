console.log("router loaded");
const express = require('express');
const router = express.Router();
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const hbs = require('../hbs');
const db = require('../db');

// xj.use(session({
//     secret: process.env.SESSION_SIGNATURE,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: process.env.MDB_URI_SRV,
//         collectionName: 'session-store',
//         ttl: 60 * 60 * 24 * 30,
//         autoRemove: 'interval',
//         autoRemoveInterval: 5,
//     }),
//     cookie: {
//         sameSite: true,
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 * 30,
//     },
// }));


// Load Page
router.get('/gokongwei', async (req,res) => {
    try {
        let roomsList = ["G302", "G303", "G304", "G305", "G306"];
        const timesList  = [
            "0730", "0800", "0830", "0900", "0930", 
            "1000", "1030", "1100", "1130", "1200", 
            "1230", "1300", "1330", "1400", "1430", 
            "1500", "1530", "1600", "1630", "1700"
        ];
		const template = await hbs.getTemplate('reserve-seat', req.session.email);
		const argjson = {
            bldg: "Gokongwei Wing",
            rooms: roomsList,
            time: timesList
        };
        res.render('reserve-seat', {
			...template,
			...argjson,
		});
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.get('/henrysy', async (req,res) => {
    try {
        let roomsList = ["H802", "H803", "H901", "H1001", "H1002"];
        const timesList  = [
            "0730", "0800", "0830", "0900", "0930", 
            "1000", "1030", "1100", "1130", "1200", 
            "1230", "1300", "1330", "1400", "1430", 
            "1500", "1530", "1600", "1630", "1700"
        ];
		const template = await hbs.getTemplate('reserve-seat', req.session.email);
		const argjson = {
            bldg: "Henry Sy Star",
            rooms: roomsList,
            time: timesList
        };
        res.render('reserve-seat', {
			...template,
			...argjson,
		});
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.get('/stlasalle', async (req,res) => {
    console.log(req.session.email);
    try {
        let roomsList = ["L220", "L229", "L230", "L319", "L320"];
        const timesList  = [
            "0730", "0800", "0830", "0900", "0930", 
            "1000", "1030", "1100", "1130", "1200", 
            "1230", "1300", "1330", "1400", "1430", 
            "1500", "1530", "1600", "1630", "1700"
        ];
        const template = await hbs.getTemplate('reserve-seat', req.session.email);
		const argjson = {
            bldg: "St. Lasalle Ship",
            rooms: roomsList,
            time: timesList
        };
        res.render('reserve-seat', {
			...template,
			...argjson,
		});
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Get Available Seats
router.get('/api/get-seats', async (req, res) => {
    console.log("GET request received!");
    try {
        const { start, room } = req.query;
        const startTime = new Date(start);
        const endTime = new Date(startTime.getTime() + (30 * 60 * 1000));        
        // let endDateTime = `${startTime.getDate()}T${endTime.slice(0, 2)}:${endTime.slice(2)}:00Z`;
        const booked = await db.getUsers({
            "reservations.details.startTime": {$lt: endTime}, 
            "reservations.details.endTime": {$gt: startTime}, 
            "reservations.details.room": room
        });
        console.log(booked);
        let takenSeats = [];
        
        if (booked && Array.isArray(booked)) {
            booked.forEach(user => {
                if (user.reservations) {
                    user.reservations.forEach(rsv => {
                        const rsvStart = new Date(rsv.details.startTime);
                        const rsvEnd = new Date(rsv.details.endTime);
                        
                        if (rsv.details.room === room && 
                        // new Date(rsv.details.startTime).getTime() === startTime.getTime() &&
                        rsvStart < endTime && rsvEnd > startTime) {
                            takenSeats.push(...rsv.details.seats);
                        }   
                    });
                }
            });
        }
        
        res.status(200).json({ seats: takenSeats });

    } catch (err) {
        console.error(err);
        res.status(500).json({ seats: [], error: "Server error" });
    }
});

router.get('/ping', (req, res) => {
    res.send("Router is ALIVE!");
});


// Reserve the seats
// - Handle conflicts
router.post('/api/reserve', async (req,res)=>{
    console.log("Session Data:", req.session.email);
    console.log("ENTERED API RESERVE");
    try {
        let {bldg, room, startT, endT, seats, anon} = req.body;
        let email = req.session.email;
        let u = await db.getUser(email, {})
        if(anon){
            sessionUsername = "";
        }
        else{
            let sessionUsername = u.settings.username;
        }
    
        const reservation = {
            dt_request: new Date(),
            details: {
                requestor: sessionUsername,
                building: bldg,
                room: room,
                startTime: new Date(startT),
                endTime: new Date(endT),
                seats: seats,
            }
        }
    
        const seatConflict = await db.getUsers({
            "reservations.details.startTime": new Date(startT),
            "reservations.details.room": room,
            "reservations.details.seats": {$in: seats}
        });
        
        if(seatConflict && seatConflict.length>0){
            return res.status(409).json({message: "Seat already taken by another user. Please refresh"});
        }
        
        let success = await db.addReservations(email, reservation)
        if(success){
            res.status(201).json({message: "Success"});
        } else {
            res.status(500).json({ message: "Failed to save reservation" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
    console.log("EXITED API RESERVE");

});

module.exports = router;