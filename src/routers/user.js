const express = require('express')

const router = express.Router()

const {createUser, updateUser, updateProfile} = require('../controllers/user')

router.post('/', createUser)

router.put('/profile/:id', updateProfile)

router.put('/:id', updateUser)

module.exports = router
