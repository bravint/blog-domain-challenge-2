const express = require('express');

const router = express.Router();

const {
    createPost,
    createComment,
    getPosts,
    getPostsByUser,
} = require('../controllers/post');

router.post('/', createPost);

router.post('/:id/comment/', createComment);

router.get('/', getPosts);

router.get('/user/:user', getPostsByUser);

module.exports = router;
