import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { GET_POSTS, LIKE_POST, UNLIKE_POST } from '../graphql/queries';
import { PostConnection, PostFilter, PostSort, PostSortField, SortOrder } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.125rem;
`;

const FiltersSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
`;

const PostsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PostCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-weight: 600;
`;

const PostDate = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PostStatus = styled.span<{ $published: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ theme, $published }) => 
    $published ? theme.colors.success + '20' : theme.colors.warning + '20'};
  color: ${({ theme, $published }) => 
    $published ? theme.colors.success : theme.colors.warning};
`;

const PostTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PostExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.75rem;
  font-weight: 500;
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LikeButton = styled.button<{ $liked?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme, $liked }) => $liked ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $liked }) => $liked ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const ReadMoreLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Posts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(undefined);
  const [sortField, setSortField] = useState<PostSortField>(PostSortField.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const filter: PostFilter = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedTag && { tags: [selectedTag] }),
    ...(publishedFilter !== undefined && { published: publishedFilter })
  };

  const sort: PostSort = {
    field: sortField,
    order: sortOrder
  };

  const { data, loading, error } = useQuery<{ posts: PostConnection }>(GET_POSTS, {
    variables: {
      filter,
      sort,
      pagination: { limit: 20, offset: 0 }
    }
  });

  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);

  const handleLike = async (postId: string, currentLikes: number) => {
    const isLiked = likedPosts.has(postId);
    
    try {
      if (isLiked) {
        // Unlike the post
        await unlikePost({
          variables: { id: postId },
          optimisticResponse: {
            unlikePost: {
              __typename: 'Post',
              id: postId,
              likes: Math.max(0, currentLikes - 1)
            }
          }
        });
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        // Like the post
        await likePost({
          variables: { id: postId },
          optimisticResponse: {
            likePost: {
              __typename: 'Post',
              id: postId,
              likes: currentLikes + 1
            }
          }
        });
        setLikedPosts(prev => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Posts</Title>
        <Description>
          Explore our collection of posts and see GraphQL queries in action. 
          Try different filters and sorting options to see how GraphQL handles complex data operations.
        </Description>
      </Header>

      <FiltersSection>
        <h3 style={{ marginBottom: '1rem' }}>Filters & Search</h3>
        <FiltersGrid>
          <FilterGroup>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <Label>Status</Label>
            <Select
              value={filter.published?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value;
                setPublishedFilter(value === '' ? undefined : value === 'true');
              }}
            >
              <option value="">All Posts</option>
              <option value="true">Published</option>
              <option value="false">Drafts</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Sort By</Label>
            <Select
              value={sort.field}
              onChange={(e) => {
                setSortField(e.target.value as PostSortField);
              }}
            >
              <option value={PostSortField.CREATED_AT}>Created Date</option>
              <option value={PostSortField.UPDATED_AT}>Updated Date</option>
              <option value={PostSortField.TITLE}>Title</option>
              <option value={PostSortField.LIKES}>Likes</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Order</Label>
            <Select
              value={sort.order}
              onChange={(e) => {
                setSortOrder(e.target.value as SortOrder);
              }}
            >
              <option value={SortOrder.DESC}>Descending</option>
              <option value={SortOrder.ASC}>Ascending</option>
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersSection>

      {loading ? (
        <LoadingSpinner>
          <div className="loading" />
        </LoadingSpinner>
      ) : error ? (
        <ErrorMessage>Error loading posts: {error.message}</ErrorMessage>
      ) : data && (
        <PostsGrid>
          {data.posts.posts.map((post) => (
            <PostCard key={post.id}>
              <PostHeader>
                <Avatar src={post.author.avatar || ''} alt={post.author.name} />
                <AuthorInfo>
                  <AuthorName>{post.author.name}</AuthorName>
                  <PostDate>{new Date(post.createdAt).toLocaleDateString()}</PostDate>
                </AuthorInfo>
                <PostStatus $published={post.published}>
                  {post.published ? 'Published' : 'Draft'}
                </PostStatus>
              </PostHeader>

              <PostTitle>{post.title}</PostTitle>
              <PostExcerpt>{post.excerpt}</PostExcerpt>

              <PostTags>
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </PostTags>

              <PostFooter>
                <PostActions>
                  <LikeButton 
                    $liked={likedPosts.has(post.id)}
                    onClick={() => handleLike(post.id, post.likes)}
                  >
                    {likedPosts.has(post.id) ? '❤️' : '🤍'} {post.likes}
                  </LikeButton>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {post.comments?.length || 0} comments
                  </span>
                </PostActions>
                <ReadMoreLink to={`/posts/${post.id}`}>
                  Read More →
                </ReadMoreLink>
              </PostFooter>
            </PostCard>
          ))}
        </PostsGrid>
      )}
    </Container>
  );
};

export default Posts;