import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GET_STATS, GET_POPULAR_POSTS } from '../graphql/queries';
import { Stats, Post } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const Hero = styled.section`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10 0%, ${({ theme }) => theme.colors.secondary}10 100%);
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    text-decoration: none;
    color: white;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StatsSection = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StatCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const PopularPostsSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const PostsList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PostCard = styled(Link)`
  display: block;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    text-decoration: none;
    color: inherit;
  }
`;

const PostTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
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

const Home: React.FC = () => {
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery<{ stats: Stats }>(GET_STATS);
  const { data: postsData, loading: postsLoading, error: postsError } = useQuery<{ popularPosts: Post[] }>(GET_POPULAR_POSTS, {
    variables: { limit: 3 }
  });

  return (
    <Container>
      <Hero>
        <HeroTitle>GraphQL Simplified</HeroTitle>
        <HeroSubtitle>
          Learn GraphQL through interactive examples, real-world demonstrations, 
          and hands-on tutorials. Understand the power of GraphQL and how it revolutionizes API development.
        </HeroSubtitle>
        <CTAButton to="/tutorial">Start Learning GraphQL</CTAButton>
      </Hero>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>🚀</FeatureIcon>
          <FeatureTitle>Interactive Playground</FeatureTitle>
          <FeatureDescription>
            Experiment with GraphQL queries, mutations, and subscriptions in real-time. 
            See how GraphQL's flexibility allows you to request exactly the data you need.
          </FeatureDescription>
          <FeatureLink to="/playground">Try the Playground →</FeatureLink>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📚</FeatureIcon>
          <FeatureTitle>Comprehensive Tutorial</FeatureTitle>
          <FeatureDescription>
            Step-by-step guides covering GraphQL fundamentals, advanced patterns, 
            and best practices. Perfect for beginners and experienced developers alike.
          </FeatureDescription>
          <FeatureLink to="/tutorial">Start Tutorial →</FeatureLink>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Real-time Statistics</FeatureTitle>
          <FeatureDescription>
            Explore how GraphQL handles complex queries and relationships. 
            See live statistics and data aggregations in action.
          </FeatureDescription>
          <FeatureLink to="/stats">View Statistics →</FeatureLink>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>User Management</FeatureTitle>
          <FeatureDescription>
            Discover how GraphQL simplifies user data fetching with nested queries 
            and efficient relationship handling.
          </FeatureDescription>
          <FeatureLink to="/users">Browse Users →</FeatureLink>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📝</FeatureIcon>
          <FeatureTitle>Content Management</FeatureTitle>
          <FeatureDescription>
            See GraphQL mutations in action with post creation, updates, and deletions. 
            Learn about optimistic updates and error handling.
          </FeatureDescription>
          <FeatureLink to="/posts">Explore Posts →</FeatureLink>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>Advanced Queries</FeatureTitle>
          <FeatureDescription>
            Master filtering, sorting, pagination, and search functionality. 
            Understand how GraphQL makes complex data operations simple.
          </FeatureDescription>
          <FeatureLink to="/posts">Try Advanced Queries →</FeatureLink>
        </FeatureCard>
      </FeaturesGrid>

      {statsLoading ? (
        <LoadingSpinner>
          <div className="loading" />
        </LoadingSpinner>
      ) : statsError ? (
        <ErrorMessage>Error loading statistics: {statsError.message}</ErrorMessage>
      ) : statsData && (
        <StatsSection>
          <SectionTitle>Platform Statistics</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>{statsData.stats.totalUsers}</StatNumber>
              <StatLabel>Total Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{statsData.stats.totalPosts}</StatNumber>
              <StatLabel>Total Posts</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{statsData.stats.totalComments}</StatNumber>
              <StatLabel>Total Comments</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{statsData.stats.publishedPosts}</StatNumber>
              <StatLabel>Published Posts</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{statsData.stats.averagePostsPerUser.toFixed(1)}</StatNumber>
              <StatLabel>Avg Posts/User</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>
      )}

      <PopularPostsSection>
        <SectionTitle>Popular Posts</SectionTitle>
        {postsLoading ? (
          <LoadingSpinner>
            <div className="loading" />
          </LoadingSpinner>
        ) : postsError ? (
          <ErrorMessage>Error loading posts: {postsError.message}</ErrorMessage>
        ) : postsData && (
          <PostsList>
            {postsData.popularPosts.map((post) => (
              <PostCard key={post.id} to={`/posts/${post.id}`}>
                <PostTitle>{post.title}</PostTitle>
                <p>{post.excerpt}</p>
                <PostMeta>
                  <span>By {post.author.name}</span>
                  <span>•</span>
                  <span>{post.likes} likes</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </PostMeta>
              </PostCard>
            ))}
          </PostsList>
        )}
      </PopularPostsSection>
    </Container>
  );
};

export default Home;