import { gql } from '@apollo/client';

// User queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      username
      avatar
      bio
      createdAt
      posts {
        id
        title
        likes
        published
        createdAt
      }
      comments {
        id
        content
        likes
        createdAt
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      username
      avatar
      bio
      createdAt
      posts {
        id
        title
        excerpt
        published
        likes
        createdAt
      }
      comments {
        id
        content
        likes
        createdAt
        post {
          id
          title
        }
      }
    }
  }
`;

// Post queries
export const GET_POSTS = gql`
  query GetPosts($filter: PostFilter, $sort: PostSort, $pagination: PaginationInput) {
    posts(filter: $filter, sort: $sort, pagination: $pagination) {
      posts {
        id
        title
        content
        excerpt
        tags
        likes
        published
        createdAt
        updatedAt
        author {
          id
          name
          username
          avatar
        }
        comments {
          id
          content
          author {
            id
            name
            username
          }
          likes
          createdAt
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      excerpt
      tags
      likes
      published
      createdAt
      updatedAt
      author {
        id
        name
        username
        avatar
        bio
      }
      comments {
        id
        content
        author {
          id
          name
          username
          avatar
        }
        likes
        createdAt
        replies {
          id
          content
          author {
            id
            name
            username
            avatar
          }
          likes
          createdAt
        }
      }
    }
  }
`;

export const GET_POPULAR_POSTS = gql`
  query GetPopularPosts($limit: Int) {
    popularPosts(limit: $limit) {
      id
      title
      excerpt
      likes
      author {
        id
        name
        username
        avatar
      }
      createdAt
    }
  }
`;

// Search queries
export const SEARCH_POSTS = gql`
  query SearchPosts($query: String!) {
    searchPosts(query: $query) {
      id
      title
      excerpt
      tags
      likes
      author {
        id
        name
        username
        avatar
      }
      createdAt
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      name
      username
      avatar
      bio
    }
  }
`;

// Statistics query
export const GET_STATS = gql`
  query GetStats {
    stats {
      totalUsers
      totalPosts
      totalComments
      publishedPosts
      draftPosts
      averagePostsPerUser
      mostPopularTags {
        tag
        count
      }
    }
  }
`;

// Mutations
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      excerpt
      tags
      likes
      published
      createdAt
      author {
        id
        name
        username
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      excerpt
      tags
      published
      updatedAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      likes
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($id: ID!) {
    unlikePost(id: $id) {
      id
      likes
    }
  }
`;

export const PUBLISH_POST = gql`
  mutation PublishPost($id: ID!) {
    publishPost(id: $id) {
      id
      published
      updatedAt
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      author {
        id
        name
        username
        avatar
      }
      likes
      createdAt
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($id: ID!) {
    likeComment(id: $id) {
      id
      likes
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      username
      avatar
      bio
      createdAt
    }
  }
`;