const express = require('express');

const router = express.Router();

const {
    getPosts,
    getPostsByUser,
    createPost,
    createComment,
    updatePost,
    updateComment,
    updateCategory,
    deletePost
} = require('../controllers/post');

router.get('/', getPosts);

router.get('/user/:user', getPostsByUser);

router.post('/', createPost);

router.post('/:id/comment/', createComment);

router.put('/:id', updatePost);

router.put('/:id/comment/:id', updateComment);

router.put('/category/:id', updateCategory);

router.delete('/:id', deletePost)

module.exports = router;
