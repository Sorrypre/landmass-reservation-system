const express = require('express');
const router = express.Router();
const hbs = require('../hbs');

module.exports = router;

// Load Page
router.get('/', (req,res) => {
    try {
        res.render('reserve-seat', hbs.getTemplate('reserve-seat'));
    } catch (error) {
        res.status(500).send(error.message);
    }
});


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
                takenSeats.concat(resv.details.seats);
            }
        })
    })
    res.json(takenSeats);
});


// Reserve the seats
// - Handle conflicts
router.post('/api/reserve', (req,res)=>{
    let {schedule, room, seats} = req.body;
    reservation.dt_request = new Date();

    const conflict = db.instance.collection("Users").find({
        "reservation.details.schedule": schedule,
        "reservation.details.room": room,
        "reservation.details.seats": {$in: [seats]}
    });

    if(conflict){
        return res.status(409).json({message: "Seat/s already taken by another user. Please refresh"});
    }

    let result = db.instance.collection("Users").insertOne(reservation);
    result.save();
    res.status(201).json({message: "Success"});
});