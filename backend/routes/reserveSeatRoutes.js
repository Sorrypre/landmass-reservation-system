console.log("router loaded");
const express = require('express');
const router = express.Router();
const hbs = require('../hbs');
const db = require('../db');

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
            bldg: "Gokongwei Hall",
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
            bldg: "Henry Sy Hall",
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
    try {
        let roomsList = ["L220", "L229", "L230", "L319", "L320"];
        const timesList  = [
            "0730", "0800", "0830", "0900", "0930", 
            "1000", "1030", "1100", "1130", "1200", 
            "1230", "1300", "1330", "1400", "1430", 
            "1500", "1530", "1600", "1630", "1700"
        ];
        const template = await hbs.getTemplate('reserve-seat');
		const argjson = {
            bldg: "St. Lasalle Hall",
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
    console.log("POST request received!");
    try {
        const { start, room } = req.query;
        const startTime = new Date(start);

        const booked = await db.getUsers({
            "reservations.details.startTime": startTime, 
            "reservations.details.room": room
        });
        console.log(booked);
        let takenSeats = [];
        
        if (booked && Array.isArray(booked)) {
            booked.forEach(user => {
                if (user.reservations) {
                    user.reservations.forEach(rsv => {
                        if (rsv.details.room === room && new Date(rsv.details.startTime).getTime() === startTime.getTime()) {
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
    try {
        let {bldg, room, startT, endT, seats, email} = req.body;
        let sessionUsername = db.getUser(email, {});
    
        const reservation = {
            dt_request: Date,
            details: {
                requestor: sessionUsername,
                building: bldg,
                room: room,
                startTime: startT,
                endTime: endT,
                seats: seats,
            }
        }
    
        const conflict = await db.getUsers({
            "reservation.details.startTime": new Date(startT).getTime(),
            "reservation.details.room": room,
            "reservation.details.seats": {$in: [seats]}
        });
        
        if(conflict && conflict.length>0){
            return res.status(409).json({message: "Seat already taken by another user. Please refresh"});
        }
        
        let success = await addReservations(email, reservation)
        if(success){
            res.status(201).json({message: "Success"});
        } else {
            res.status(500).json({ message: "Failed to save reservation" });
        }
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;