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
    
    takenSeats.forEach(user =>{
        user.reservation.forEach(rsv => {
            if(rsv.details.room === room && rsv.details.schedule === schedule){
                takenSeats.concat(resv.details.seats);
            }
        })
    })
    res.json(takenSeats);
});
