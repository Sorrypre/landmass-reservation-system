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


