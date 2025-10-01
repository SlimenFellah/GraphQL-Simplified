const { pool } = require('./database');
const { v4: uuidv4 } = require('uuid');

const resolvers = {
  // Query resolvers - how to fetch data
  Query: {
    // User queries
    users: async () => {
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows.map(user => ({
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      }));
    },
    
    user: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      const user = result.rows[0];
      return {
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      };
    },
    
    userByUsername: async (_, { username }) => {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) return null;
      const user = result.rows[0];
      return {
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      };
    },

    // Post queries with filtering, sorting, and pagination
    posts: async (_, { filter, sort, pagination }) => {
      let baseQuery = 'FROM posts';
      let conditions = [];
      let params = [];
      let paramIndex = 1;

      // Apply filters
      if (filter) {
        if (filter.published !== undefined) {
          conditions.push(`published = $${paramIndex}`);
          params.push(filter.published);
          paramIndex++;
        }
        if (filter.authorId) {
          conditions.push(`author_id = $${paramIndex}`);
          params.push(filter.authorId);
          paramIndex++;
        }
        if (filter.tags && filter.tags.length > 0) {
          conditions.push(`tags && $${paramIndex}`);
          params.push(filter.tags);
          paramIndex++;
        }
        if (filter.search) {
          conditions.push(`(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex} OR excerpt ILIKE $${paramIndex})`);
          params.push(`%${filter.search}%`);
          paramIndex++;
        }
      }

      if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
      }

      // Get total count for pagination
      const countQuery = 'SELECT COUNT(*) ' + baseQuery;
      const countResult = await pool.query(countQuery, params);
      const totalCount = parseInt(countResult.rows[0].count);

      // Build main query with sorting
      let query = 'SELECT * ' + baseQuery;
      
      // Apply sorting
      let orderBy = 'created_at DESC';
      if (sort) {
        const field = sort.field === 'CREATED_AT' ? 'created_at' :
                     sort.field === 'UPDATED_AT' ? 'updated_at' :
                     sort.field === 'TITLE' ? 'title' :
                     sort.field === 'LIKES' ? 'likes' : 'created_at';
        const order = sort.order === 'ASC' ? 'ASC' : 'DESC';
        orderBy = `${field} ${order}`;
      }
      query += ` ORDER BY ${orderBy}`;

      // Apply pagination
      const limit = pagination?.limit || 10;
      const offset = pagination?.offset || 0;
      
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);
      const posts = result.rows.map(post => ({
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      }));
      
      return {
        posts,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0
      };
    },

    post: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },
    
    popularPosts: async (_, { limit = 5 }) => {
      const result = await pool.query(
        'SELECT * FROM posts WHERE published = true ORDER BY likes DESC LIMIT $1',
        [limit]
      );
      return result.rows.map(post => ({
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      }));
    },

    // Comment queries
    comments: async (_, { postId }) => {
      const result = await pool.query(
        'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC',
        [postId]
      );
      return result.rows.map(comment => ({
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      }));
    },
    
    comment: async (_, { id }) => {
      const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      const comment = result.rows[0];
      return {
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      };
    },

    // Search queries
    searchPosts: async (_, { query }) => {
      const result = await pool.query(
        `SELECT * FROM posts 
         WHERE published = true 
         AND (title ILIKE $1 OR content ILIKE $1 OR $2 = ANY(tags))
         ORDER BY created_at DESC`,
        [`%${query}%`, query.toLowerCase()]
      );
      return result.rows.map(post => ({
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      }));
    },

    searchUsers: async (_, { query }) => {
      const result = await pool.query(
        `SELECT * FROM users 
         WHERE name ILIKE $1 OR username ILIKE $1 OR bio ILIKE $1
         ORDER BY created_at DESC`,
        [`%${query}%`]
      );
      return result.rows.map(user => ({
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      }));
    },

    // Statistics
    stats: async () => {
      const [usersResult, postsResult, commentsResult, publishedResult, draftResult] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT COUNT(*) FROM posts'),
        pool.query('SELECT COUNT(*) FROM comments'),
        pool.query('SELECT COUNT(*) FROM posts WHERE published = true'),
        pool.query('SELECT COUNT(*) FROM posts WHERE published = false')
      ]);

      // Calculate tag statistics
      const tagsResult = await pool.query(`
        SELECT unnest(tags) as tag, COUNT(*) as count 
        FROM posts 
        GROUP BY tag 
        ORDER BY count DESC 
        LIMIT 10
      `);
      
      const mostPopularTags = tagsResult.rows.map(row => ({
        tag: row.tag,
        count: parseInt(row.count)
      }));

      const totalUsers = parseInt(usersResult.rows[0].count);
      const totalPosts = parseInt(postsResult.rows[0].count);

      return {
        totalUsers,
        totalPosts,
        totalComments: parseInt(commentsResult.rows[0].count),
        publishedPosts: parseInt(publishedResult.rows[0].count),
        draftPosts: parseInt(draftResult.rows[0].count),
        averagePostsPerUser: totalUsers > 0 ? totalPosts / totalUsers : 0,
        mostPopularTags
      };
    }
  },

  // Mutation resolvers - how to modify data
  Mutation: {
    // User mutations
    createUser: async (_, { input }) => {
      // Check if username already exists
      const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [input.username]);
      if (existingUser.rows.length > 0) {
        throw new Error('Username already exists. Please choose a different username.');
      }

      // Check if email already exists
      const existingEmail = await pool.query('SELECT id FROM users WHERE email = $1', [input.email]);
      if (existingEmail.rows.length > 0) {
        throw new Error('Email already exists. Please use a different email address.');
      }

      const result = await pool.query(
        'INSERT INTO users (name, email, username, avatar, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [input.name, input.email, input.username, input.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`, input.bio]
      );
      const user = result.rows[0];
      return {
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      };
    },

    updateUser: async (_, { id, input }) => {
      const result = await pool.query(
        'UPDATE users SET name = COALESCE($2, name), email = COALESCE($3, email), username = COALESCE($4, username), avatar = COALESCE($5, avatar), bio = COALESCE($6, bio) WHERE id = $1 RETURNING *',
        [id, input.name, input.email, input.username, input.avatar, input.bio]
      );
      if (result.rows.length === 0) throw new Error('User not found');
      const user = result.rows[0];
      return {
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      };
    },

    deleteUser: async (_, { id }) => {
      const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return result.rowCount > 0;
    },

    // Post mutations
    createPost: async (_, { input }, context) => {
      // In a real app, you'd get the current user from context/authentication
      // For now, get the first user as default author
      const userResult = await pool.query('SELECT id FROM users LIMIT 1');
      const authorId = userResult.rows[0]?.id;
      
      if (!authorId) throw new Error('No users found. Please create a user first.');
      
      const result = await pool.query(
        'INSERT INTO posts (title, content, excerpt, author_id, tags, published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [input.title, input.content, input.excerpt, authorId, input.tags || [], input.published || false]
      );
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },

    updatePost: async (_, { id, input }) => {
      const result = await pool.query(
        'UPDATE posts SET title = COALESCE($2, title), content = COALESCE($3, content), excerpt = COALESCE($4, excerpt), tags = COALESCE($5, tags), published = COALESCE($6, published) WHERE id = $1 RETURNING *',
        [id, input.title, input.content, input.excerpt, input.tags, input.published]
      );
      if (result.rows.length === 0) throw new Error('Post not found');
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },

    deletePost: async (_, { id }) => {
      const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
      return result.rowCount > 0;
    },

    publishPost: async (_, { id }) => {
      const result = await pool.query(
        'UPDATE posts SET published = true WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) throw new Error('Post not found');
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },

    unpublishPost: async (_, { id }) => {
      const result = await pool.query(
        'UPDATE posts SET published = false WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) throw new Error('Post not found');
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },

    likePost: async (_, { id }) => {
      const result = await pool.query(
        'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) throw new Error('Post not found');
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },

    unlikePost: async (_, { id }) => {
      const result = await pool.query(
        'UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) throw new Error('Post not found');
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },

    // Comment mutations
    createComment: async (_, { input }) => {
      // In a real app, you'd get the current user from context/authentication
      // For now, get the second user as default author
      const userResult = await pool.query('SELECT id FROM users OFFSET 1 LIMIT 1');
      const authorId = userResult.rows[0]?.id;
      
      if (!authorId) {
        // Fallback to first user if second doesn't exist
        const firstUserResult = await pool.query('SELECT id FROM users LIMIT 1');
        const fallbackAuthorId = firstUserResult.rows[0]?.id;
        if (!fallbackAuthorId) throw new Error('No users found. Please create a user first.');
        authorId = fallbackAuthorId;
      }
      
      const result = await pool.query(
        'INSERT INTO comments (content, author_id, post_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [input.content, authorId, input.postId, input.parentId || null]
      );
      const comment = result.rows[0];
      return {
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      };
    },

    updateComment: async (_, { id, content }) => {
      const result = await pool.query(
        'UPDATE comments SET content = $2 WHERE id = $1 RETURNING *',
        [id, content]
      );
      if (result.rows.length === 0) throw new Error('Comment not found');
      const comment = result.rows[0];
      return {
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      };
    },

    deleteComment: async (_, { id }) => {
      const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
      return result.rowCount > 0;
    },

    likeComment: async (_, { id }) => {
      const result = await pool.query(
        'UPDATE comments SET likes = likes + 1 WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) throw new Error('Comment not found');
      const comment = result.rows[0];
      return {
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      };
    },

    unlikeComment: async (_, { id }) => {
      const result = await pool.query(
        'UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) throw new Error('Comment not found');
      const comment = result.rows[0];
      return {
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      };
    }
  },

  // Field resolvers - how to resolve relationships between types
  User: {
    posts: async (user) => {
      const result = await pool.query('SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC', [user.id]);
      return result.rows.map(post => ({
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      }));
    },
    comments: async (user) => {
      const result = await pool.query('SELECT * FROM comments WHERE author_id = $1 ORDER BY created_at DESC', [user.id]);
      return result.rows.map(comment => ({
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      }));
    }
  },

  Post: {
    author: async (post) => {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [post.authorId || post.author_id]);
      if (result.rows.length === 0) return null;
      const user = result.rows[0];
      return {
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      };
    },
    comments: async (post) => {
      const result = await pool.query(
        'SELECT * FROM comments WHERE post_id = $1 AND parent_id IS NULL ORDER BY created_at ASC',
        [post.id]
      );
      return result.rows.map(comment => ({
        ...comment,
        authorId: comment.author_id,
        postId: comment.post_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at.toISOString(),
        updatedAt: comment.updated_at.toISOString()
      }));
    }
  },

  Comment: {
    author: async (comment) => {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [comment.authorId || comment.author_id]);
      if (result.rows.length === 0) return null;
      const user = result.rows[0];
      return {
        ...user,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString()
      };
    },
    post: async (comment) => {
      const result = await pool.query('SELECT * FROM posts WHERE id = $1', [comment.postId || comment.post_id]);
      if (result.rows.length === 0) return null;
      const post = result.rows[0];
      return {
        ...post,
        authorId: post.author_id,
        createdAt: post.created_at.toISOString(),
        updatedAt: post.updated_at.toISOString()
      };
    },
    replies: async (comment) => {
      const result = await pool.query(
        'SELECT * FROM comments WHERE parent_id = $1 ORDER BY created_at ASC',
        [comment.id]
      );
      return result.rows.map(reply => ({
        ...reply,
        authorId: reply.author_id,
        postId: reply.post_id,
        parentId: reply.parent_id,
        createdAt: reply.created_at.toISOString(),
        updatedAt: reply.updated_at.toISOString()
      }));
    }
  }
};

module.exports = resolvers;