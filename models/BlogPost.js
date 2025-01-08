// models/BlogPost.js
import mongoose, {model, models, Schema} from "mongoose";

const BlogPostSchema = new Schema({
  title: {type: String, required: true},
  slug: {type: String, required: true, unique: true},
  content: {type: String, required: true},
  excerpt: {type: String, required: true},
  coverImage: {type: String, required: true},
  category: {type: String, required: true},
  publishedAt: {type: Date, required: true},
}, {
  timestamps: true,
});

export const BlogPost = models?.BlogPost || model('BlogPost', BlogPostSchema);