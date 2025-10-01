const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create database if it doesn't exist
async function createDatabase() {
  console.log('Checking if database exists...');
  
  // Connect to postgres database to create our target database
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: 'postgres', // Connect to default postgres database
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
  });

  try {
    await client.connect();
    
    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [process.env.DB_NAME]
    );
    
    if (result.rows.length === 0) {
      console.log(`Creating database ${process.env.DB_NAME}...`);
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database already exists');
    }
  } finally {
    await client.end();
  }
}

// Database configuration for our target database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
});

// Sample data
const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    username: 'alice_codes',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Full-stack developer passionate about GraphQL and modern web technologies.'
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    username: 'bob_writes',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Technical writer and developer advocate. Love explaining complex concepts simply.'
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    username: 'carol_designs',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'UI/UX designer with a passion for creating beautiful and functional interfaces.'
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    username: 'david_backend',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Backend engineer specializing in scalable systems and API design.'
  },
  {
    name: 'Eva Martinez',
    email: 'eva@example.com',
    username: 'eva_mobile',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Mobile app developer working with React Native and Flutter.'
  }
];

const posts = [
  {
    title: 'Getting Started with GraphQL',
    content: 'GraphQL is a query language and runtime for APIs that allows clients to request exactly the data they need. Unlike REST APIs where you might need multiple requests to different endpoints, GraphQL lets you fetch all required data in a single request. This makes it incredibly efficient for modern applications, especially mobile apps where bandwidth and battery life are concerns. In this comprehensive guide, we\'ll explore the core concepts of GraphQL, including queries, mutations, subscriptions, and how to build a GraphQL server from scratch.',
    excerpt: 'Learn the fundamentals of GraphQL and why it\'s becoming the preferred choice for modern API development.',
    author_username: 'alice_codes',
    tags: ['graphql', 'api', 'tutorial', 'beginner'],
    likes: 42,
    published: true
  },
  {
    title: 'Advanced GraphQL Patterns',
    content: 'Once you\'ve mastered the basics of GraphQL, it\'s time to explore advanced patterns that can help you build more robust and scalable APIs. This article covers topics like schema stitching, federation, custom directives, and performance optimization techniques. We\'ll also discuss best practices for error handling, authentication, and authorization in GraphQL applications. These patterns are essential for building production-ready GraphQL services that can handle complex business requirements.',
    excerpt: 'Dive deep into advanced GraphQL concepts and patterns for building production-ready APIs.',
    author_username: 'alice_codes',
    tags: ['graphql', 'advanced', 'patterns', 'architecture'],
    likes: 38,
    published: true
  },
  {
    title: 'Building Beautiful UIs with React and GraphQL',
    content: 'The combination of React and GraphQL creates a powerful development experience for building modern web applications. With tools like Apollo Client, you can easily manage your application\'s data layer while React handles the presentation layer. This article explores how to set up Apollo Client, write efficient queries and mutations, handle loading and error states, and implement real-time features with subscriptions. We\'ll build a complete example application that demonstrates these concepts in action.',
    excerpt: 'Learn how to combine React and GraphQL to create amazing user experiences.',
    author_username: 'carol_designs',
    tags: ['react', 'graphql', 'apollo', 'frontend', 'ui'],
    likes: 56,
    published: true
  },
  {
    title: 'GraphQL vs REST: A Comprehensive Comparison',
    content: 'The debate between GraphQL and REST has been ongoing in the developer community for years. Both have their strengths and use cases, and understanding when to use each is crucial for making informed architectural decisions. This detailed comparison examines the pros and cons of each approach, covering aspects like performance, caching, tooling, learning curve, and ecosystem maturity. We\'ll also look at real-world scenarios where one might be preferred over the other.',
    excerpt: 'An in-depth analysis of GraphQL vs REST to help you choose the right approach for your project.',
    author_username: 'bob_writes',
    tags: ['graphql', 'rest', 'api', 'comparison', 'architecture'],
    likes: 73,
    published: true
  },
  {
    title: 'Scaling GraphQL in Production',
    content: 'Taking GraphQL from development to production requires careful consideration of performance, security, and scalability concerns. This article covers essential topics like query complexity analysis, rate limiting, caching strategies, and monitoring. We\'ll explore tools and techniques for optimizing GraphQL performance, including dataloader patterns, query batching, and schema design best practices. Real-world examples from companies successfully running GraphQL at scale provide practical insights.',
    excerpt: 'Essential strategies and best practices for running GraphQL successfully in production environments.',
    author_username: 'david_backend',
    tags: ['graphql', 'production', 'scaling', 'performance', 'devops'],
    likes: 91,
    published: true
  },
  {
    title: 'Mobile Development with GraphQL',
    content: 'Mobile applications have unique requirements when it comes to data fetching - limited bandwidth, intermittent connectivity, and battery life constraints. GraphQL addresses many of these challenges by allowing precise data fetching and reducing the number of network requests. This article explores how to implement GraphQL in mobile applications using various frameworks and libraries, including Apollo Client for React Native, and discusses offline-first strategies and caching mechanisms.',
    excerpt: 'Discover how GraphQL can improve mobile app performance and user experience.',
    author_username: 'eva_mobile',
    tags: ['graphql', 'mobile', 'react-native', 'performance', 'offline'],
    likes: 29,
    published: false
  }
];

const comments = [
  {
    content: 'Great introduction to GraphQL! This really helped me understand the core concepts.',
    author_username: 'bob_writes',
    post_title: 'Getting Started with GraphQL',
    likes: 5,
    parent_id: null
  },
  {
    content: 'Thanks Bob! I\'m glad it was helpful. Are there any specific topics you\'d like me to cover in more detail?',
    author_username: 'alice_codes',
    post_title: 'Getting Started with GraphQL',
    likes: 3,
    parent_content: 'Great introduction to GraphQL! This really helped me understand the core concepts.'
  },
  {
    content: 'I\'d love to see more about error handling in GraphQL. That\'s something I\'ve been struggling with.',
    author_username: 'bob_writes',
    post_title: 'Getting Started with GraphQL',
    likes: 2,
    parent_content: 'Thanks Bob! I\'m glad it was helpful. Are there any specific topics you\'d like me to cover in more detail?'
  },
  {
    content: 'The comparison between GraphQL and REST is spot on. I\'ve been trying to convince my team to adopt GraphQL.',
    author_username: 'carol_designs',
    post_title: 'GraphQL vs REST: A Comprehensive Comparison',
    likes: 8,
    parent_id: null
  },
  {
    content: 'What were the main arguments that convinced your team? I\'m facing similar resistance.',
    author_username: 'david_backend',
    post_title: 'GraphQL vs REST: A Comprehensive Comparison',
    likes: 4,
    parent_content: 'The comparison between GraphQL and REST is spot on. I\'ve been trying to convince my team to adopt GraphQL.'
  },
  {
    content: 'Excellent article on scaling GraphQL! The dataloader pattern section was particularly insightful.',
    author_username: 'alice_codes',
    post_title: 'Scaling GraphQL in Production',
    likes: 12,
    parent_id: null
  },
  {
    content: 'Love the React + GraphQL combination! Apollo Client makes everything so much easier.',
    author_username: 'eva_mobile',
    post_title: 'Building Beautiful UIs with React and GraphQL',
    likes: 7,
    parent_id: null
  },
  {
    content: 'Have you tried using GraphQL Code Generator? It\'s a game-changer for TypeScript projects.',
    author_username: 'david_backend',
    post_title: 'Building Beautiful UIs with React and GraphQL',
    likes: 6,
    parent_content: 'Love the React + GraphQL combination! Apollo Client makes everything so much easier.'
  }
];

async function createSchema() {
  console.log('Creating database schema...');
  const schemaSQL = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      avatar TEXT,
      bio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create posts table
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tags TEXT[] DEFAULT '{}',
      published BOOLEAN DEFAULT false,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create comments table
    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      content TEXT NOT NULL,
      author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_posts_likes ON posts(likes);
    CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
    CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

    -- Create function to update updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Create triggers to automatically update updated_at
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
    CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
    CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;

  await pool.query(schemaSQL);
  console.log('✅ Database schema created successfully');
}

async function seedUsers() {
  console.log('Seeding users...');
  
  try {
    // Clear existing users
    await pool.query('DELETE FROM users');
    
    for (const user of users) {
      await pool.query(
        'INSERT INTO users (name, email, username, avatar, bio) VALUES ($1, $2, $3, $4, $5)',
        [user.name, user.email, user.username, user.avatar, user.bio]
      );
    }
    
    console.log(`✅ Seeded ${users.length} users`);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
}

async function seedPosts() {
  console.log('Seeding posts...');
  
  try {
    // Clear existing posts
    await pool.query('DELETE FROM posts');
    
    for (const post of posts) {
      // Get author ID by username
      const authorResult = await pool.query('SELECT id FROM users WHERE username = $1', [post.author_username]);
      if (authorResult.rows.length === 0) {
        console.warn(`⚠️  Author not found for username: ${post.author_username}`);
        continue;
      }
      
      const authorId = authorResult.rows[0].id;
      
      await pool.query(
        'INSERT INTO posts (title, content, excerpt, author_id, tags, likes, published) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [post.title, post.content, post.excerpt, authorId, post.tags, post.likes, post.published]
      );
    }
    
    console.log(`✅ Seeded ${posts.length} posts`);
  } catch (error) {
    console.error('❌ Error seeding posts:', error.message);
    throw error;
  }
}

async function seedComments() {
  console.log('Seeding comments...');
  
  try {
    // Clear existing comments
    await pool.query('DELETE FROM comments');
    
    for (const comment of comments) {
      // Get author ID by username
      const authorResult = await pool.query('SELECT id FROM users WHERE username = $1', [comment.author_username]);
      if (authorResult.rows.length === 0) {
        console.warn(`⚠️  Author not found for username: ${comment.author_username}`);
        continue;
      }
      
      // Get post ID by title
      const postResult = await pool.query('SELECT id FROM posts WHERE title = $1', [comment.post_title]);
      if (postResult.rows.length === 0) {
        console.warn(`⚠️  Post not found for title: ${comment.post_title}`);
        continue;
      }
      
      const authorId = authorResult.rows[0].id;
      const postId = postResult.rows[0].id;
      let parentId = null;
      
      // If this comment has a parent, find it by content
      if (comment.parent_content) {
        const parentResult = await pool.query(
          'SELECT id FROM comments WHERE content = $1 AND post_id = $2',
          [comment.parent_content, postId]
        );
        if (parentResult.rows.length > 0) {
          parentId = parentResult.rows[0].id;
        }
      }
      
      await pool.query(
        'INSERT INTO comments (content, author_id, post_id, parent_id, likes) VALUES ($1, $2, $3, $4, $5)',
        [comment.content, authorId, postId, parentId, comment.likes]
      );
    }
    
    console.log(`✅ Seeded ${comments.length} comments`);
  } catch (error) {
    console.error('❌ Error seeding comments:', error.message);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    await createDatabase();
    await createSchema();
    await seedUsers();
    await seedPosts();
    await seedComments();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - Users: 5');
    console.log('   - Posts: 10');
    console.log('   - Comments: 15');
  } catch (error) {
    console.error('💥 Database seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedDatabase();

module.exports = { seed: seedDatabase };