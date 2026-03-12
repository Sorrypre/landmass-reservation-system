const express = require('express');
const router = express.Router();
const hbs = require('../hbs');


// Load Page
router.get('/gokongwei', (req,res) => {
    try {
        let roomsList = ["G302", "G303", "G304", "G305", "G306"];
        const timesList  = [
            "0730", "0800", "0830", "0900", "0930", 
            "1000", "1030", "1100", "1130", "1200", 
            "1230", "1300", "1330", "1400", "1430", 
            "1500", "1530", "1600", "1630", "1700"
        ];
        res.render('reserve-seat', {
            bldg: "Gokongwei Hall",
            rooms: roomsList,
            time: timesList
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.get('/henrysy', (req,res) => {
    try {
        let roomsList = ["H802", "H803", "H901", "H1001", "H1002"];
        const timesList  = [
            "0730", "0800", "0830", "0900", "0930", 
            "1000", "1030", "1100", "1130", "1200", 
            "1230", "1300", "1330", "1400", "1430", 
            "1500", "1530", "1600", "1630", "1700"
        ];
        res.render('reserve-seat', {
            bldg: "Henry Sy Hall",
            rooms: roomsList,
            time: timesList
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.get('/stlasalle', (req,res) => {
    try {
        let roomsList = ["L220", "L229", "L230", "L319", "L320"];
        const timesList  = [
            "0730", "0800", "0830", "0900", "0930", 
            "1000", "1030", "1100", "1130", "1200", 
            "1230", "1300", "1330", "1400", "1430", 
            "1500", "1530", "1600", "1630", "1700"
        ];
        res.render('reserve-seat', {
            bldg: "St. Lasalle Hall",
            rooms: roomsList,
            time: timesList
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

// Get Available Seats
router.get('/api/get-seats', (req,res)=>{
    // query in reserve-seat.js with "/api/get-seats"
    const {schedule, room} = req.query;

    const booked = db.instance.collection("Users").find({
        "reservation.details.schedule": schedule, 
        "reservation.details.room": room})
        .toArray();

    let takenSeats = [];
    
    booked.forEach(user =>{
        user.reservation.forEach(rsv => {
            if(rsv.details.room === room && rsv.details.schedule === schedule){
                takenSeats.concat(rsv.details.seats);
            }
        })
    })
    console.log(takenSeats);
    res.json(takenSeats);
});


// // Reserve the seats
// // - Handle conflicts
// router.post('/api/reserve', (req,res)=>{
//     let {schedule, room, seats} = req.body;
//     reservation.dt_request = new Date();

//     const conflict = db.instance.collection("Users").find({
//         "reservation.details.schedule": schedule,
//         "reservation.details.room": room,
//         "reservation.details.seats": {$in: [seats]}
//     });

//     if(conflict){
//         return res.status(409).json({message: "Seat/s already taken by another user. Please refresh"});
//     }

//     let result = db.instance.collection("Users").insertOne(reservation);
//     result.save();
//     res.status(201).json({message: "Success"});
// });