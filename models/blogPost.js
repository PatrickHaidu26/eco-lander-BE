const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    authorType: { 
        type: String, 
        enum: ['smartland', 'ecosmart'],
        required: true
    },
    authorId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { 
        type: String,
        required: true,
        trim: true
    },
    content: { 
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxlength: 200
    },
    images: [{
        url: String,
        caption: String,
        alt: String
    }],
    tags: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['news', 'events', 'projects', 'technology', 'sustainability', 'other'],
        default: 'other'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Update the updatedAt field before saving
blogPostSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
