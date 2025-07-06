const Gallery = require('../models/Gallery');
const fs = require('fs').promises;
const path = require('path');

// Upload image to gallery
exports.uploadImage = async (req, res) => {
    try {
        const { title, description, category, tags, isPublic } = req.body;
        const uploadedBy = req.body.uploadedBy || 'anonymous';

        let imageUrl = req.body.imageUrl;
        
        if (req.body.imageData && req.body.imageData.startsWith('data:image')) {
            const base64Data = req.body.imageData.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const uploadPath = path.join(__dirname, '../uploads', fileName);
            
            await fs.mkdir(path.dirname(uploadPath), { recursive: true });
            await fs.writeFile(uploadPath, buffer);
            
            imageUrl = `/uploads/${fileName}`;
        }

        const galleryItem = new Gallery({
            title,
            description,
            imageUrl,
            category: category || 'other',
            tags: tags || [],
            uploadedBy,
            isPublic: isPublic !== undefined ? isPublic : true
        });

        await galleryItem.save();
        res.status(201).json(galleryItem);
    } catch (error) {
        console.error('Gallery upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
};

// Get all public images
exports.getImages = async (req, res) => {
    try {
        const { page = 1, limit = 12, sort = 'createdAt' } = req.query;
        const skip = (page - 1) * limit;

        const images = await Gallery.find({ isPublic: true })
            .populate('uploadedBy', 'name email')
            .sort({ [sort]: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Gallery.countDocuments({ isPublic: true });

        res.status(200).json({
            images,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get images error:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
};

// Get images by category
exports.getImagesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        const images = await Gallery.find({ 
            category, 
            isPublic: true 
        })
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Gallery.countDocuments({ 
            category, 
            isPublic: true 
        });

        res.status(200).json({
            images,
            category,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get images by category error:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
};

// Get single image by ID
exports.getImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Gallery.findById(id)
            .populate('uploadedBy', 'name email');

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        image.views += 1;
        await image.save();

        res.status(200).json(image);
    } catch (error) {
        console.error('Get image by ID error:', error);
        res.status(500).json({ message: 'Failed to fetch image' });
    }
};

// Update image
exports.updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, tags, isPublic } = req.body;

        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const updatedImage = await Gallery.findByIdAndUpdate(
            id,
            { title, description, category, tags, isPublic },
            { new: true }
        ).populate('uploadedBy', 'name email');

        res.status(200).json(updatedImage);
    } catch (error) {
        console.error('Update image error:', error);
        res.status(500).json({ message: 'Failed to update image' });
    }
};

// Delete image
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (image.imageUrl && image.imageUrl.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', image.imageUrl);
            try {
                await fs.unlink(filePath);
            } catch (fileError) {
                console.error('File deletion error:', fileError);
            }
        }

        await Gallery.findByIdAndDelete(id);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
};

// Like/unlike image
exports.likeImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        image.likes += 1;
        await image.save();

        res.status(200).json({ likes: image.likes });
    } catch (error) {
        console.error('Like image error:', error);
        res.status(500).json({ message: 'Failed to like image' });
    }
}; 