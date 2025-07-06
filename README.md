# EcoBE - Backend API

A Node.js Express backend API for the EcoBE application with support for blog posts, gallery, user management, and more.

## Features

- 🔐 **Authentication** - JWT-based auth for SmartLand and EcoSmart users
- 👥 **User Management** - Separate user models for different platforms
- 📝 **Blog System** - Blog posts with image support
- 🖼️ **Gallery** - Image gallery with categories and likes
- 📧 **Email Service** - Nodemailer integration for notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecoBE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=8080
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/ecobe
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL=your-email@gmail.com
   EMAIL_PASS=your-app-password
   RECEIVER_EMAIL=admin@example.com
   FRONTEND_URL=http://localhost:3000
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "userType": "smartland"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123",
    "userType": "smartland"
  }
  ```
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get current user profile
- `GET /api/users/all?userType=smartland` - Get all users by type
- `GET /api/users/getByEmail/:email?userType=smartland` - Get user by email
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Blog Posts
- `GET /api/blog` - Get all published posts
- `GET /api/blog/:id` - Get post by ID
- `POST /api/blog` - Create new post
- `PUT /api/blog/:id` - Update post
- `DELETE /api/blog/:id` - Delete post
- `POST /api/blog/:id/like` - Like a post

### Gallery
- `GET /api/gallery` - Get all public images
- `GET /api/gallery/category/:category` - Get images by category
- `GET /api/gallery/:id` - Get image by ID
- `POST /api/gallery` - Upload image
- `PUT /api/gallery/:id` - Update image
- `DELETE /api/gallery/:id` - Delete image
- `POST /api/gallery/:id/like` - Like an image

### EcoSmart
- `POST /api/ecosmart/questionnaire` - Submit questionnaire

### SmartLand
- `POST /api/smartland/report` - Report incident

## Data Models

### SmartLand User
```javascript
{
  name: String,
  email: String,
  password: String,
  createdAt: Date
}
```

### EcoSmart User
```javascript
{
  name: String,
  email: String,
  password: String,
  createdAt: Date
}
```

### Blog Post
```javascript
{
  authorType: ['smartland', 'ecosmart'],
  authorId: ObjectId,
  title: String,
  content: String,
  excerpt: String,
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  tags: [String],
  category: ['news', 'events', 'projects', 'technology', 'sustainability', 'other'],
  status: ['draft', 'published', 'archived'],
  views: Number,
  likes: Number,
  featured: Boolean
}
```

### Gallery
```javascript
{
  title: String,
  description: String,
  imageUrl: String,
  category: ['events', 'projects', 'nature', 'technology', 'other'],
  tags: [String],
  uploadedBy: ObjectId,
  isPublic: Boolean,
  views: Number,
  likes: Number
}
```

## File Upload

Images can be uploaded as:
- Base64 encoded strings
- URLs to external images

Uploaded images are stored in the `uploads/` directory.

## Development

```bash
npm run dev
```

## Production

```bash
npm start
``` 