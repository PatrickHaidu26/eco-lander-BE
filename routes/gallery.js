const express = require('express');
const router = express.Router();
const { 
    uploadImage, 
    getImages, 
    getImageById, 
    updateImage, 
    deleteImage,
    likeImage,
    getImagesByCategory
} = require('../controllers/galleryController');

// Public routes
router.get('/', getImages);
router.get('/category/:category', getImagesByCategory);
router.get('/:id', getImageById);

// Protected routes
router.post('/', uploadImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);
router.post('/:id/like', likeImage);

module.exports = router; 