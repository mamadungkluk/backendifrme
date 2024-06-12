const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift');

// Tambahkan route untuk CRUD operasi pada Shift
router.get('/', async (req, res) => {
    try {
        const shifts = await Shift.find();
        res.json(shifts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const shift = new Shift({
        shiftName: req.body.shiftName,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    });
    try {
        const newShift = await shift.save();
        res.status(201).json(newShift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Tambahkan route lainnya sesuai kebutuhan

module.exports = router;
