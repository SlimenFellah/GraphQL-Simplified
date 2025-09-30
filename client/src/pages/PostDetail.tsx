import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { GET_POST } from '../graphql/queries';
import { Post } from '../types';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
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

const PostContainer = styled.article`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const PostTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PostDate = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PostContent = styled.div`
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.75rem;
  font-weight: 500;
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<{ post: Post }>(GET_POST, {
    variables: { id },
    skip: !id
  });

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div className="loading" />
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>Error loading post: {error.message}</ErrorMessage>
      </Container>
    );
  }

  if (!data?.post) {
    return (
      <Container>
        <ErrorMessage>Post not found</ErrorMessage>
      </Container>
    );
  }

  const { post } = data;

  return (
    <Container>
      <PostContainer>
        <PostTitle>{post.title}</PostTitle>
        
        <PostMeta>
          <Avatar 
            src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`} 
            alt={post.author.name} 
          />
          <AuthorInfo>
            <AuthorName>{post.author.name}</AuthorName>
            <PostDate>
              Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </PostDate>
          </AuthorInfo>
        </PostMeta>

        <PostContent>
          {post.content}
        </PostContent>

        <PostTags>
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </PostTags>

        <PostStats>
          <StatItem>
            ❤️ {post.likes} likes
          </StatItem>
          <StatItem>
            💬 {post.comments?.length || 0} comments
          </StatItem>
          <StatItem>
            👁️ Published: {post.published ? 'Yes' : 'No'}
          </StatItem>
        </PostStats>
      </PostContainer>
    </Container>
  );
};

export default PostDetail;