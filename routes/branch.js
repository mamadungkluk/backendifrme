const express = require('express');
const router = express.Router();
const Branch = require('../models/branch');

// GET all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// CREATE a new branch
router.post('/', async (req, res) => {
  const branch = new Branch({
    name: req.body.name,
    address: req.body.address
  });

  try {
    const newBranch = await branch.save();
    res.status(201).json(newBranch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
