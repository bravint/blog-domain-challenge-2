const express = require('express');

const router = express.Router();

const {
    getPost,
    getPostByUser,
    createPost,
    createComment,
    updatePost,
    handleUpdateComment,
    updateCategory,
    deletePost,
    handleDeleteComment
} = require('../controllers/post');

router.get('/', getPost);

router.get('/user/:user', getPostByUser);

router.post('/', createPost);

router.post('/:id/comment/', createComment);

router.put('/:id', updatePost);

router.put('/:id/comment/:id', handleUpdateComment);

router.put('/category/:id', updateCategory);

router.delete('/:id', deletePost)

router.delete('/:id/comment/:id', handleDeleteComment);

module.exports = router;
