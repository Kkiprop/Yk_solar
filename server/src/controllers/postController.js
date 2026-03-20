import { Post } from '../models/Post.js';

export const getPublishedPosts = async (_request, response) => {
  const posts = await Post.find({ published: true }).sort({ featured: -1, createdAt: -1 });
  response.json(posts);
};

export const getAdminPosts = async (_request, response) => {
  const posts = await Post.find().sort({ updatedAt: -1 });
  response.json(posts);
};

export const getAdminDashboard = async (_request, response) => {
  const [totalPosts, publishedPosts, featuredPosts, recentPosts] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ published: true }),
    Post.countDocuments({ featured: true }),
    Post.find().sort({ updatedAt: -1 }).limit(5).select('title category published featured updatedAt'),
  ]);

  response.json({
    stats: {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      featuredPosts,
    },
    recentPosts,
  });
};

export const createPost = async (request, response) => {
  const post = await Post.create(request.body);
  response.status(201).json(post);
};

export const updatePost = async (request, response) => {
  const post = await Post.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return response.status(404).json({ message: 'Post not found' });
  }

  return response.json(post);
};

export const deletePost = async (request, response) => {
  const post = await Post.findByIdAndDelete(request.params.id);

  if (!post) {
    return response.status(404).json({ message: 'Post not found' });
  }

  return response.status(204).send();
};
