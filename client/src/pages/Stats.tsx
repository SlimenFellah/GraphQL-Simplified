import React from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { GET_STATS, GET_USERS, GET_POSTS } from '../graphql/queries';
import { Stats as StatsType, User, PostConnection } from '../types';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const StatDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ChartsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChartTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserActivityList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserActivityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-weight: 600;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActivityStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ActivityStat = styled.div``;

const ActivityValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActivityLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

const Tag = styled.span<{ $size: number }>`
  background-color: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ $size }) => Math.max(0.75, Math.min(1.5, $size / 10))}rem;
  font-weight: 500;
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

const RecentActivity = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Stats: React.FC = () => {
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery<{ stats: StatsType }>(GET_STATS);
  const { data: usersData, loading: usersLoading } = useQuery<{ users: User[] }>(GET_USERS);
  const { data: postsData, loading: postsLoading } = useQuery<{ posts: PostConnection }>(GET_POSTS, {
    variables: {
      pagination: { limit: 50, offset: 0 }
    }
  });

  // Calculate additional statistics
  const userStats = usersData?.users.map(user => ({
    ...user,
    postCount: user.posts?.length || 0,
    commentCount: user.comments?.length || 0,
    totalLikes: user.posts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0
  })).sort((a, b) => b.postCount - a.postCount) || [];

  // Extract all tags and count them
  const tagCounts = postsData?.posts.posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  if (statsLoading || usersLoading || postsLoading) {
    return (
      <Container>
        <LoadingSpinner>
          <div className="loading" />
        </LoadingSpinner>
      </Container>
    );
  }

  if (statsError) {
    return (
      <Container>
        <ErrorMessage>Error loading statistics: {statsError.message}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Statistics Dashboard</Title>
        <Description>
          Comprehensive analytics and insights powered by GraphQL queries. 
          See how GraphQL can efficiently aggregate and present complex data relationships.
        </Description>
      </Header>

      {statsData && (
        <StatsGrid>
          <StatCard>
            <StatValue>{statsData.stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
            <StatDescription>Registered community members</StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>{statsData.stats.totalPosts}</StatValue>
            <StatLabel>Total Posts</StatLabel>
            <StatDescription>Published and draft content</StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>{statsData.stats.publishedPosts}</StatValue>
            <StatLabel>Published Posts</StatLabel>
            <StatDescription>Live content available to readers</StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>{statsData.stats.draftPosts}</StatValue>
            <StatLabel>Draft Posts</StatLabel>
            <StatDescription>Content in progress</StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>{statsData.stats.totalComments}</StatValue>
            <StatLabel>Total Comments</StatLabel>
            <StatDescription>Community engagement</StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>{statsData.stats.averagePostsPerUser.toFixed(1)}</StatValue>
            <StatLabel>Avg Posts/User</StatLabel>
            <StatDescription>Content creation rate</StatDescription>
          </StatCard>
        </StatsGrid>
      )}

      <ChartsSection>
        <SectionTitle>User Activity</SectionTitle>
        <ChartContainer>
          <ChartTitle>Top Content Creators</ChartTitle>
          <UserActivityList>
            {userStats.slice(0, 10).map((user) => (
              <UserActivityItem key={user.id}>
                <UserInfo>
                  <Avatar 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                    alt={user.name} 
                  />
                  <UserDetails>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserDetails>
                </UserInfo>
                <ActivityStats>
                  <ActivityStat>
                    <ActivityValue>{user.postCount}</ActivityValue>
                    <ActivityLabel>Posts</ActivityLabel>
                  </ActivityStat>
                  <ActivityStat>
                    <ActivityValue>{user.commentCount}</ActivityValue>
                    <ActivityLabel>Comments</ActivityLabel>
                  </ActivityStat>
                  <ActivityStat>
                    <ActivityValue>{user.totalLikes}</ActivityValue>
                    <ActivityLabel>Likes</ActivityLabel>
                  </ActivityStat>
                </ActivityStats>
              </UserActivityItem>
            ))}
          </UserActivityList>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Popular Tags</ChartTitle>
          <TagCloud>
            {sortedTags.map(([tag, count]) => (
              <Tag key={tag} $size={count}>
                {tag} ({count})
              </Tag>
            ))}
          </TagCloud>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Recent Activity</ChartTitle>
          <RecentActivity>
            {postsData?.posts.posts.slice(0, 10).map((post) => (
              <ActivityItem key={post.id}>
                <ActivityIcon>📝</ActivityIcon>
                <ActivityContent>
                  <ActivityText>
                    <strong>{post.author.name}</strong> {post.published ? 'published' : 'created'} "{post.title}"
                  </ActivityText>
                  <ActivityTime>
                    {new Date(post.createdAt).toLocaleDateString()} • {post.likes} likes
                  </ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </RecentActivity>
        </ChartContainer>
      </ChartsSection>
    </Container>
  );
};

export default Stats;