const express = require('express')

const router = express.Router()

const {createUser, updateUser} = require('../controllers/user')

router.post('/', createUser)

router.put('/:id', updateUser)

module.exports = router
