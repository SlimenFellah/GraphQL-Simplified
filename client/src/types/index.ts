// User types
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  posts?: Post[];
  comments?: Comment[];
}

// Post types
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: User;
  authorId: string;
  tags: string[];
  likes: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  author: User;
  authorId: string;
  post?: Post;
  postId: string;
  likes: number;
  createdAt: string;
  replies?: Comment[];
  parentId?: string;
}

// Input types
export interface CreateUserInput {
  name: string;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
}

// Filter and sorting types
export interface PostFilter {
  published?: boolean;
  authorId?: string;
  tags?: string[];
  search?: string;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum PostSortField {
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  TITLE = 'TITLE',
  LIKES = 'LIKES'
}

export interface PostSort {
  field: PostSortField;
  order: SortOrder;
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

// Response types
export interface PostConnection {
  posts: Post[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  publishedPosts: number;
  draftPosts: number;
  averagePostsPerUser: number;
  mostPopularTags: TagStats[];
}

export interface TagStats {
  tag: string;
  count: number;
}

// Component props types
export interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
}

export interface UserCardProps {
  user: User;
  showStats?: boolean;
}

export interface CommentProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
}

export interface SearchResultsProps {
  query: string;
  posts?: Post[];
  users?: User[];
  loading?: boolean;
}

export interface StatsCardProps {
  stats: Stats;
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}