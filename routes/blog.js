const express = require('express');
const router = express.Router();
const { 
    createPost, 
    getPosts, 
    getPostById, 
    updatePost, 
    deletePost, 
    likePost 
} = require('../controllers/blogController');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);

module.exports = router;
