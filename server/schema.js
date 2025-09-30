const { gql } = require('graphql-tag');

const typeDefs = gql`
  # User type representing a user in our system
  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    avatar: String
    bio: String
    createdAt: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  # Post type representing a blog post or article
  type Post {
    id: ID!
    title: String!
    content: String!
    excerpt: String
    author: User!
    authorId: ID!
    tags: [String!]!
    likes: Int!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
  }

  # Comment type representing comments on posts
  type Comment {
    id: ID!
    content: String!
    author: User!
    authorId: ID!
    post: Post!
    postId: ID!
    likes: Int!
    createdAt: String!
    replies: [Comment!]!
    parentId: ID
  }

  # Input types for mutations
  input CreateUserInput {
    name: String!
    email: String!
    username: String!
    bio: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    excerpt: String
    tags: [String!]!
    published: Boolean = false
  }

  input UpdatePostInput {
    title: String
    content: String
    excerpt: String
    tags: [String!]
    published: Boolean
  }

  input CreateCommentInput {
    content: String!
    postId: ID!
    parentId: ID
  }

  # Filter and sorting inputs
  input PostFilter {
    published: Boolean
    authorId: ID
    tags: [String!]
    search: String
  }

  enum SortOrder {
    ASC
    DESC
  }

  enum PostSortField {
    CREATED_AT
    UPDATED_AT
    TITLE
    LIKES
  }

  input PostSort {
    field: PostSortField!
    order: SortOrder!
  }

  # Pagination input
  input PaginationInput {
    limit: Int = 10
    offset: Int = 0
  }

  # Paginated response types
  type PostConnection {
    posts: [Post!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # Query type - all the ways to fetch data
  type Query {
    # User queries
    users: [User!]!
    user(id: ID!): User
    userByUsername(username: String!): User
    
    # Post queries
    posts(
      filter: PostFilter
      sort: PostSort
      pagination: PaginationInput
    ): PostConnection!
    post(id: ID!): Post
    popularPosts(limit: Int = 5): [Post!]!
    
    # Comment queries
    comments(postId: ID!): [Comment!]!
    comment(id: ID!): Comment
    
    # Search queries
    searchPosts(query: String!): [Post!]!
    searchUsers(query: String!): [User!]!
    
    # Statistics queries
    stats: Stats!
  }

  # Statistics type for dashboard
  type Stats {
    totalUsers: Int!
    totalPosts: Int!
    totalComments: Int!
    publishedPosts: Int!
    draftPosts: Int!
    averagePostsPerUser: Float!
    mostPopularTags: [TagStats!]!
  }

  type TagStats {
    tag: String!
    count: Int!
  }

  # Mutation type - all the ways to modify data
  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: CreateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post!
    unpublishPost(id: ID!): Post!
    likePost(id: ID!): Post!
    unlikePost(id: ID!): Post!
    
    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!
    likeComment(id: ID!): Comment!
    unlikeComment(id: ID!): Comment!
  }

  # Subscription type - real-time updates
  type Subscription {
    postAdded: Post!
    postUpdated: Post!
    commentAdded(postId: ID!): Comment!
    userJoined: User!
  }
`;

module.exports = typeDefs;