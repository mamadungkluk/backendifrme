const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');


// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Simpan file di folder 'uploads/'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nama file: timestamp - originalname
    }
});

const upload = multer({ storage: storage });

// Route untuk operasi CRUD pada User
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: `Error retrieving users: ${err.message}` });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    const user = new User({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      image: req.file ? req.file.path : '',
      fullName: req.body.fullName
    });
    try {
      const salt = await bcrypt.genSalt(10); // Menghasilkan salt
      user.password = await bcrypt.hash(user.password, salt); // Meng-hash password dengan salt yang dihasilkan
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: `Error creating user: ${err.message}` });
    }
  });
  

// Route untuk menghapus user dengan validasi ID
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    next();
};

router.delete('/:id', validateObjectId, async (req, res) => {
    try {
        console.log(`Received request to delete user with id: ${req.params.id}`);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(`Error deleting user: ${err.message}`);
        res.status(500).json({ message: `Error deleting user: ${err.message}` });
    }
});

// Route untuk login
router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role },
            'IFramejaya', { expiresIn: '1d' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: `Error logging in: ${err.message}` });
    }
});
    

module.exports = router;
