const { users, posts, comments, generateId, getCurrentTimestamp } = require('./data');

const resolvers = {
  // Query resolvers - how to fetch data
  Query: {
    // User queries
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
    userByUsername: (_, { username }) => users.find(user => user.username === username),

    // Post queries with filtering, sorting, and pagination
    posts: (_, { filter, sort, pagination }) => {
      let filteredPosts = [...posts];

      // Apply filters
      if (filter) {
        if (filter.published !== undefined) {
          filteredPosts = filteredPosts.filter(post => post.published === filter.published);
        }
        if (filter.authorId) {
          filteredPosts = filteredPosts.filter(post => post.authorId === filter.authorId);
        }
        if (filter.tags && filter.tags.length > 0) {
          filteredPosts = filteredPosts.filter(post => 
            filter.tags.some(tag => post.tags.includes(tag))
          );
        }
        if (filter.search) {
          const searchLower = filter.search.toLowerCase();
          filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchLower) ||
            post.content.toLowerCase().includes(searchLower) ||
            post.excerpt?.toLowerCase().includes(searchLower)
          );
        }
      }

      // Apply sorting
      if (sort) {
        filteredPosts.sort((a, b) => {
          let aValue, bValue;
          switch (sort.field) {
            case 'CREATED_AT':
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
            case 'UPDATED_AT':
              aValue = new Date(a.updatedAt);
              bValue = new Date(b.updatedAt);
              break;
            case 'TITLE':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'LIKES':
              aValue = a.likes;
              bValue = b.likes;
              break;
            default:
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
          }

          if (sort.order === 'ASC') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      // Apply pagination
      const totalCount = filteredPosts.length;
      const limit = pagination?.limit || 10;
      const offset = pagination?.offset || 0;
      
      const paginatedPosts = filteredPosts.slice(offset, offset + limit);
      
      return {
        posts: paginatedPosts,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0
      };
    },

    post: (_, { id }) => posts.find(post => post.id === id),
    
    popularPosts: (_, { limit = 5 }) => {
      return [...posts]
        .filter(post => post.published)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, limit);
    },

    // Comment queries
    comments: (_, { postId }) => comments.filter(comment => comment.postId === postId),
    comment: (_, { id }) => comments.find(comment => comment.id === id),

    // Search queries
    searchPosts: (_, { query }) => {
      const searchLower = query.toLowerCase();
      return posts.filter(post => 
        post.published && (
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      );
    },

    searchUsers: (_, { query }) => {
      const searchLower = query.toLowerCase();
      return users.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.bio?.toLowerCase().includes(searchLower)
      );
    },

    // Statistics
    stats: () => {
      const publishedPosts = posts.filter(post => post.published);
      const draftPosts = posts.filter(post => !post.published);
      
      // Calculate tag statistics
      const tagCounts = {};
      posts.forEach(post => {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      
      const mostPopularTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalUsers: users.length,
        totalPosts: posts.length,
        totalComments: comments.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        averagePostsPerUser: posts.length / users.length,
        mostPopularTags
      };
    }
  },

  // Mutation resolvers - how to modify data
  Mutation: {
    // User mutations
    createUser: (_, { input }) => {
      const newUser = {
        id: generateId(),
        ...input,
        avatar: `https://i.pravatar.cc/150?img=${users.length + 1}`,
        createdAt: getCurrentTimestamp()
      };
      users.push(newUser);
      return newUser;
    },

    updateUser: (_, { id, input }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      users[userIndex] = { ...users[userIndex], ...input };
      return users[userIndex];
    },

    deleteUser: (_, { id }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return false;
      
      users.splice(userIndex, 1);
      // Also remove user's posts and comments
      posts.filter(post => post.authorId === id).forEach(post => {
        const postIndex = posts.findIndex(p => p.id === post.id);
        posts.splice(postIndex, 1);
      });
      comments.filter(comment => comment.authorId === id).forEach(comment => {
        const commentIndex = comments.findIndex(c => c.id === comment.id);
        comments.splice(commentIndex, 1);
      });
      
      return true;
    },

    // Post mutations
    createPost: (_, { input }, context) => {
      // In a real app, you'd get the current user from context/authentication
      const authorId = '1'; // Default to first user for demo
      
      const newPost = {
        id: generateId(),
        ...input,
        authorId,
        likes: 0,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp()
      };
      posts.push(newPost);
      return newPost;
    },

    updatePost: (_, { id, input }) => {
      const postIndex = posts.findIndex(post => post.id === id);
      if (postIndex === -1) throw new Error('Post not found');
      
      posts[postIndex] = { 
        ...posts[postIndex], 
        ...input, 
        updatedAt: getCurrentTimestamp() 
      };
      return posts[postIndex];
    },

    deletePost: (_, { id }) => {
      const postIndex = posts.findIndex(post => post.id === id);
      if (postIndex === -1) return false;
      
      posts.splice(postIndex, 1);
      // Also remove post's comments
      comments.filter(comment => comment.postId === id).forEach(comment => {
        const commentIndex = comments.findIndex(c => c.id === comment.id);
        comments.splice(commentIndex, 1);
      });
      
      return true;
    },

    publishPost: (_, { id }) => {
      const post = posts.find(post => post.id === id);
      if (!post) throw new Error('Post not found');
      
      post.published = true;
      post.updatedAt = getCurrentTimestamp();
      return post;
    },

    unpublishPost: (_, { id }) => {
      const post = posts.find(post => post.id === id);
      if (!post) throw new Error('Post not found');
      
      post.published = false;
      post.updatedAt = getCurrentTimestamp();
      return post;
    },

    likePost: (_, { id }) => {
      const post = posts.find(post => post.id === id);
      if (!post) throw new Error('Post not found');
      
      post.likes += 1;
      return post;
    },

    unlikePost: (_, { id }) => {
      const post = posts.find(post => post.id === id);
      if (!post) throw new Error('Post not found');
      
      post.likes = Math.max(0, post.likes - 1);
      return post;
    },

    // Comment mutations
    createComment: (_, { input }) => {
      // In a real app, you'd get the current user from context/authentication
      const authorId = '2'; // Default to second user for demo
      
      const newComment = {
        id: generateId(),
        ...input,
        authorId,
        likes: 0,
        createdAt: getCurrentTimestamp()
      };
      comments.push(newComment);
      return newComment;
    },

    updateComment: (_, { id, content }) => {
      const comment = comments.find(comment => comment.id === id);
      if (!comment) throw new Error('Comment not found');
      
      comment.content = content;
      return comment;
    },

    deleteComment: (_, { id }) => {
      const commentIndex = comments.findIndex(comment => comment.id === id);
      if (commentIndex === -1) return false;
      
      comments.splice(commentIndex, 1);
      // Also remove replies to this comment
      comments.filter(comment => comment.parentId === id).forEach(reply => {
        const replyIndex = comments.findIndex(c => c.id === reply.id);
        comments.splice(replyIndex, 1);
      });
      
      return true;
    },

    likeComment: (_, { id }) => {
      const comment = comments.find(comment => comment.id === id);
      if (!comment) throw new Error('Comment not found');
      
      comment.likes += 1;
      return comment;
    },

    unlikeComment: (_, { id }) => {
      const comment = comments.find(comment => comment.id === id);
      if (!comment) throw new Error('Comment not found');
      
      comment.likes = Math.max(0, comment.likes - 1);
      return comment;
    }
  },

  // Field resolvers - how to resolve relationships between types
  User: {
    posts: (user) => posts.filter(post => post.authorId === user.id),
    comments: (user) => comments.filter(comment => comment.authorId === user.id)
  },

  Post: {
    author: (post) => users.find(user => user.id === post.authorId),
    comments: (post) => comments.filter(comment => comment.postId === post.id && !comment.parentId)
  },

  Comment: {
    author: (comment) => users.find(user => user.id === comment.authorId),
    post: (comment) => posts.find(post => post.id === comment.postId),
    replies: (comment) => comments.filter(reply => reply.parentId === comment.id)
  }
};

module.exports = resolvers;