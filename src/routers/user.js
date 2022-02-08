const express = require('express');

const router = express.Router();

const {
    createUser,
    updateUser,
    updateProfile,
    deleteUser,
} = require('../controllers/user');

router.post('/', createUser);

router.put('/profile/:id', updateProfile);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
