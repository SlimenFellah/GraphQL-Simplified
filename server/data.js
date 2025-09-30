const { v4: uuidv4 } = require('uuid');

// Mock data for demonstration
const users = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    username: 'alice_codes',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Full-stack developer passionate about GraphQL and modern web technologies.',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    username: 'bob_writes',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Technical writer and developer advocate. Love explaining complex concepts simply.',
    createdAt: '2023-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    username: 'carol_designs',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'UI/UX designer with a passion for creating beautiful and functional interfaces.',
    createdAt: '2023-03-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    username: 'david_backend',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Backend engineer specializing in scalable systems and API design.',
    createdAt: '2023-04-05T16:45:00Z'
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    username: 'eva_mobile',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Mobile app developer working with React Native and Flutter.',
    createdAt: '2023-05-12T11:20:00Z'
  }
];

const posts = [
  {
    id: '1',
    title: 'Getting Started with GraphQL',
    content: 'GraphQL is a query language and runtime for APIs that allows clients to request exactly the data they need. Unlike REST APIs where you might need multiple requests to different endpoints, GraphQL lets you fetch all required data in a single request. This makes it incredibly efficient for modern applications, especially mobile apps where bandwidth and battery life are concerns. In this comprehensive guide, we\'ll explore the core concepts of GraphQL, including queries, mutations, subscriptions, and how to build a GraphQL server from scratch.',
    excerpt: 'Learn the fundamentals of GraphQL and why it\'s becoming the preferred choice for modern API development.',
    authorId: '1',
    tags: ['graphql', 'api', 'tutorial', 'beginner'],
    likes: 42,
    published: true,
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2023-06-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Advanced GraphQL Patterns',
    content: 'Once you\'ve mastered the basics of GraphQL, it\'s time to explore advanced patterns that can help you build more robust and scalable APIs. This article covers topics like schema stitching, federation, custom directives, and performance optimization techniques. We\'ll also discuss best practices for error handling, authentication, and authorization in GraphQL applications. These patterns are essential for building production-ready GraphQL services that can handle complex business requirements.',
    excerpt: 'Dive deep into advanced GraphQL concepts and patterns for building production-ready APIs.',
    authorId: '1',
    tags: ['graphql', 'advanced', 'patterns', 'architecture'],
    likes: 38,
    published: true,
    createdAt: '2023-06-15T14:30:00Z',
    updatedAt: '2023-06-16T09:15:00Z'
  },
  {
    id: '3',
    title: 'Building Beautiful UIs with React and GraphQL',
    content: 'The combination of React and GraphQL creates a powerful development experience for building modern web applications. With tools like Apollo Client, you can easily manage your application\'s data layer while React handles the presentation layer. This article explores how to set up Apollo Client, write efficient queries and mutations, handle loading and error states, and implement real-time features with subscriptions. We\'ll build a complete example application that demonstrates these concepts in action.',
    excerpt: 'Learn how to combine React and GraphQL to create amazing user experiences.',
    authorId: '3',
    tags: ['react', 'graphql', 'apollo', 'frontend', 'ui'],
    likes: 56,
    published: true,
    createdAt: '2023-07-02T16:45:00Z',
    updatedAt: '2023-07-02T16:45:00Z'
  },
  {
    id: '4',
    title: 'GraphQL vs REST: A Comprehensive Comparison',
    content: 'The debate between GraphQL and REST has been ongoing in the developer community for years. Both have their strengths and use cases, and understanding when to use each is crucial for making informed architectural decisions. This detailed comparison examines the pros and cons of each approach, covering aspects like performance, caching, tooling, learning curve, and ecosystem maturity. We\'ll also look at real-world scenarios where one might be preferred over the other.',
    excerpt: 'An in-depth analysis of GraphQL vs REST to help you choose the right approach for your project.',
    authorId: '2',
    tags: ['graphql', 'rest', 'api', 'comparison', 'architecture'],
    likes: 73,
    published: true,
    createdAt: '2023-07-20T11:20:00Z',
    updatedAt: '2023-07-21T08:30:00Z'
  },
  {
    id: '5',
    title: 'Scaling GraphQL in Production',
    content: 'Taking GraphQL from development to production requires careful consideration of performance, security, and scalability concerns. This article covers essential topics like query complexity analysis, rate limiting, caching strategies, and monitoring. We\'ll explore tools and techniques for optimizing GraphQL performance, including dataloader patterns, query batching, and schema design best practices. Real-world examples from companies successfully running GraphQL at scale provide practical insights.',
    excerpt: 'Essential strategies and best practices for running GraphQL successfully in production environments.',
    authorId: '4',
    tags: ['graphql', 'production', 'scaling', 'performance', 'devops'],
    likes: 91,
    published: true,
    createdAt: '2023-08-10T13:15:00Z',
    updatedAt: '2023-08-10T13:15:00Z'
  },
  {
    id: '6',
    title: 'Mobile Development with GraphQL',
    content: 'Mobile applications have unique requirements when it comes to data fetching - limited bandwidth, intermittent connectivity, and battery life constraints. GraphQL addresses many of these challenges by allowing precise data fetching and reducing the number of network requests. This article explores how to implement GraphQL in mobile applications using various frameworks and libraries, including Apollo Client for React Native, and discusses offline-first strategies and caching mechanisms.',
    excerpt: 'Discover how GraphQL can improve mobile app performance and user experience.',
    authorId: '5',
    tags: ['graphql', 'mobile', 'react-native', 'performance', 'offline'],
    likes: 29,
    published: false,
    createdAt: '2023-08-25T15:45:00Z',
    updatedAt: '2023-08-26T10:20:00Z'
  }
];

const comments = [
  {
    id: '1',
    content: 'Great introduction to GraphQL! This really helped me understand the core concepts.',
    authorId: '2',
    postId: '1',
    likes: 5,
    createdAt: '2023-06-02T09:30:00Z',
    parentId: null
  },
  {
    id: '2',
    content: 'Thanks Bob! I\'m glad it was helpful. Are there any specific topics you\'d like me to cover in more detail?',
    authorId: '1',
    postId: '1',
    likes: 3,
    createdAt: '2023-06-02T10:15:00Z',
    parentId: '1'
  },
  {
    id: '3',
    content: 'I\'d love to see more about error handling in GraphQL. That\'s something I\'ve been struggling with.',
    authorId: '2',
    postId: '1',
    likes: 2,
    createdAt: '2023-06-02T11:00:00Z',
    parentId: '2'
  },
  {
    id: '4',
    content: 'The comparison between GraphQL and REST is spot on. I\'ve been trying to convince my team to adopt GraphQL.',
    authorId: '3',
    postId: '4',
    likes: 8,
    createdAt: '2023-07-21T14:20:00Z',
    parentId: null
  },
  {
    id: '5',
    content: 'What were the main arguments that convinced your team? I\'m facing similar resistance.',
    authorId: '4',
    postId: '4',
    likes: 4,
    createdAt: '2023-07-21T15:30:00Z',
    parentId: '4'
  },
  {
    id: '6',
    content: 'Excellent article on scaling GraphQL! The dataloader pattern section was particularly insightful.',
    authorId: '1',
    postId: '5',
    likes: 12,
    createdAt: '2023-08-11T08:45:00Z',
    parentId: null
  },
  {
    id: '7',
    content: 'Love the React + GraphQL combination! Apollo Client makes everything so much easier.',
    authorId: '5',
    postId: '3',
    likes: 7,
    createdAt: '2023-07-03T12:20:00Z',
    parentId: null
  },
  {
    id: '8',
    content: 'Have you tried using GraphQL Code Generator? It\'s a game-changer for TypeScript projects.',
    authorId: '4',
    postId: '3',
    likes: 6,
    createdAt: '2023-07-03T14:10:00Z',
    parentId: '7'
  }
];

// Helper functions for data manipulation
const generateId = () => uuidv4();

const getCurrentTimestamp = () => new Date().toISOString();

// Export data and helper functions
module.exports = {
  users,
  posts,
  comments,
  generateId,
  getCurrentTimestamp
};