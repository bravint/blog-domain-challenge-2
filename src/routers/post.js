const express = require('express');

const router = express.Router();

const { createPost, createComment } = require('../controllers/post');

router.post('/', createPost);

router.post('/:id/comment/', createComment);

module.exports = router;
