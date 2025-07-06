const BlogPost = require('../models/blogPost');
const fs = require('fs').promises;
const path = require('path');

exports.createPost = async (req, res) => {
    try {
        const { 
            authorType, 
            authorId, 
            title, 
            content, 
            excerpt, 
            tags, 
            category, 
            status,
            featured,
            images 
        } = req.body;

        if (!title || !content || !authorType || !authorId) {
            return res.status(400).json({ 
                message: 'Title, content, authorType, and authorId are required' 
            });
        }

        let processedImages = [];
        if (images && Array.isArray(images)) {
            processedImages = images.map(img => ({
                url: img.url,
                caption: img.caption || '',
                alt: img.alt || ''
            }));
        }

        const newPost = new BlogPost({
            authorType,
            authorId,
            title,
            content,
            excerpt: excerpt || content.substring(0, 200),
            tags: tags || [],
            category: category || 'other',
            status: status || 'draft',
            featured: featured || false,
            images: processedImages
        });

        await newPost.save();
        await newPost.populate('authorId', 'name email');
        
        res.status(201).json(newPost);
    } catch (err) {
        console.error('Create post error:', err);
        res.status(500).json({ message: 'Failed to create post', error: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            status = 'published',
            featured,
            sort = 'createdAt'
        } = req.query;

        const skip = (page - 1) * limit;
        const query = {};

        if (category) query.category = category;
        if (status) query.status = status;
        if (featured !== undefined) query.featured = featured === 'true';

        const posts = await BlogPost.find(query)
            .populate('authorId', 'name email')
            .sort({ [sort]: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await BlogPost.countDocuments(query);

        res.status(200).json({
            posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error('Get posts error:', err);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await BlogPost.findById(id)
            .populate('authorId', 'name email');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.views += 1;
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        console.error('Get post by ID error:', err);
        res.status(500).json({ message: 'Failed to fetch post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            content, 
            excerpt, 
            tags, 
            category, 
            status,
            featured,
            images 
        } = req.body;

        const post = await BlogPost.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        let processedImages = post.images;
        if (images && Array.isArray(images)) {
            processedImages = images.map(img => ({
                url: img.url,
                caption: img.caption || '',
                alt: img.alt || ''
            }));
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
            id,
            {
                title,
                content,
                excerpt: excerpt || content?.substring(0, 200),
                tags,
                category,
                status,
                featured,
                images: processedImages
            },
            { new: true }
        ).populate('authorId', 'name email');

        res.status(200).json(updatedPost);
    } catch (err) {
        console.error('Update post error:', err);
        res.status(500).json({ message: 'Failed to update post' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.images && post.images.length > 0) {
            for (const image of post.images) {
                if (image.url && image.url.startsWith('/uploads/')) {
                    const filePath = path.join(__dirname, '..', image.url);
                    try {
                        await fs.unlink(filePath);
                    } catch (fileError) {
                        console.error('File deletion error:', fileError);
                    }
                }
            }
        }

        await BlogPost.findByIdAndDelete(id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ message: 'Failed to delete post' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes += 1;
        await post.save();

        res.status(200).json({ likes: post.likes });
    } catch (err) {
        console.error('Like post error:', err);
        res.status(500).json({ message: 'Failed to like post' });
    }
};
