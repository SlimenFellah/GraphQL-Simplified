import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { GET_USER } from '../graphql/queries';
import { User } from '../types';

const Container = styled.div`
  max-width: 1000px;
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

const UserHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.border};
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const UserEmail = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const JoinDate = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const UserBio = styled.p`
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const PostsSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PostsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PostCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const PostTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PostExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
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

const ReadMoreLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<{ user: User }>(GET_USER, {
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
        <ErrorMessage>Error loading user: {error.message}</ErrorMessage>
      </Container>
    );
  }

  if (!data?.user) {
    return (
      <Container>
        <ErrorMessage>User not found</ErrorMessage>
      </Container>
    );
  }

  const { user } = data;
  const totalLikes = user.posts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;

  return (
    <Container>
      <UserHeader>
        <UserInfo>
          <Avatar 
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
            alt={user.name} 
          />
          <UserDetails>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
            <JoinDate>
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </JoinDate>
          </UserDetails>
        </UserInfo>

        {user.bio && <UserBio>{user.bio}</UserBio>}

        <UserStats>
          <StatCard>
            <StatValue>{user.posts?.length || 0}</StatValue>
            <StatLabel>Posts</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{user.comments?.length || 0}</StatValue>
            <StatLabel>Comments</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalLikes}</StatValue>
            <StatLabel>Total Likes</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{user.posts?.filter(post => post.published).length || 0}</StatValue>
            <StatLabel>Published</StatLabel>
          </StatCard>
        </UserStats>
      </UserHeader>

      {user.posts && user.posts.length > 0 && (
        <PostsSection>
          <SectionTitle>Posts by {user.name}</SectionTitle>
          <PostsGrid>
            {user.posts.map((post) => (
              <PostCard key={post.id}>
                <PostTitle>{post.title}</PostTitle>
                <PostExcerpt>{post.excerpt}</PostExcerpt>
                
                <PostTags>
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </PostTags>

                <PostMeta>
                  <div>
                    {new Date(post.createdAt).toLocaleDateString()} • 
                    {post.published ? ' Published' : ' Draft'} • 
                    ❤️ {post.likes} likes
                  </div>
                  <ReadMoreLink to={`/posts/${post.id}`}>
                    Read More →
                  </ReadMoreLink>
                </PostMeta>
              </PostCard>
            ))}
          </PostsGrid>
        </PostsSection>
      )}
    </Container>
  );
};

export default UserDetail;