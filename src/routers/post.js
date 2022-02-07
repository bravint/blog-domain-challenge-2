const express = require('express');

const router = express.Router();

const {
    getPosts,
    getPostsByUser,
    createPost,
    createComment,
    updatePost,
    updateComment,
} = require('../controllers/post');

router.get('/', getPosts);

router.get('/user/:user', getPostsByUser);

router.post('/', createPost);

router.post('/:id/comment/', createComment);

router.put('/:id', updatePost);

router.put('/:id/comment/:id', updateComment);

module.exports = router;
