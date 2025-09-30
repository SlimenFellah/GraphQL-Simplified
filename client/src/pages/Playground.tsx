import React, { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 200px);
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

const PlaygroundContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  height: 100%;
`;

const QuerySection = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SectionTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const QueryEditor = styled.textarea`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const VariablesEditor = styled.textarea`
  height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  margin-top: ${({ theme }) => theme.spacing.md};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultContainer = styled.div`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ExecuteButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const ExampleQueries = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ExampleButton = styled.button`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.875rem;
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}20;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.error}10;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const exampleQueries = [
  {
    name: 'Get All Users',
    query: `query GetUsers {
  users {
    id
    name
    email
    bio
    avatar
    createdAt
    posts {
      id
      title
      published
    }
  }
}`
  },
  {
    name: 'Get Posts with Filters',
    query: `query GetPosts($filter: PostFilter, $sort: PostSort) {
  posts(filter: $filter, sort: $sort, pagination: { limit: 5 }) {
    posts {
      id
      title
      excerpt
      published
      likes
      createdAt
      author {
        name
        avatar
      }
      tags
    }
    totalCount
    hasNextPage
  }
}`,
    variables: `{
  "filter": {
    "published": true
  },
  "sort": {
    "field": "LIKES",
    "order": "DESC"
  }
}`
  },
  {
    name: 'Create User',
    query: `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    bio
    avatar
    createdAt
  }
}`,
    variables: `{
  "input": {
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "GraphQL enthusiast",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe"
  }
}`
  },
  {
    name: 'Search Posts',
    query: `query SearchPosts($query: String!) {
  searchPosts(query: $query) {
    id
    title
    excerpt
    author {
      name
    }
    tags
    createdAt
  }
}`,
    variables: `{
  "query": "GraphQL"
}`
  },
  {
    name: 'Get Statistics',
    query: `query GetStats {
  stats {
    totalUsers
    totalPosts
    totalComments
    publishedPosts
    draftPosts
    averagePostsPerUser
    mostPopularTag
  }
}`
  }
];

const Playground: React.FC = () => {
  const [query, setQuery] = useState(exampleQueries[0].query);
  const [variables, setVariables] = useState('{}');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [executeQuery, { loading }] = useLazyQuery(gql`query { __typename }`, {
    onCompleted: (data) => {
      setResult(data);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      setResult(null);
    }
  });

  const [executeMutation] = useMutation(gql`mutation { __typename }`, {
    onCompleted: (data) => {
      setResult(data);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      setResult(null);
    }
  });

  const handleExecute = async () => {
    try {
      setError(null);
      setResult(null);

      let parsedVariables = {};
      if (variables.trim()) {
        try {
          parsedVariables = JSON.parse(variables);
        } catch (e) {
          setError('Invalid JSON in variables');
          return;
        }
      }

      const queryDoc = gql(query);
      const operation = queryDoc.definitions[0] as any;
      
      if (operation.operation === 'mutation') {
        await executeMutation({
          mutation: queryDoc,
          variables: parsedVariables
        });
      } else {
        await executeQuery({
          query: queryDoc,
          variables: parsedVariables
        });
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleExampleClick = (example: typeof exampleQueries[0]) => {
    setQuery(example.query);
    setVariables(example.variables || '{}');
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setQuery('');
    setVariables('{}');
    setResult(null);
    setError(null);
  };

  return (
    <Container>
      <Header>
        <Title>GraphQL Playground</Title>
        <Description>
          Write and execute GraphQL queries and mutations in real-time. 
          Try the example queries below or write your own to explore the API.
        </Description>
      </Header>

      <ExampleQueries>
        <h4 style={{ marginBottom: '0.5rem' }}>Example Queries:</h4>
        {exampleQueries.map((example, index) => (
          <ExampleButton
            key={index}
            onClick={() => handleExampleClick(example)}
          >
            {example.name}
          </ExampleButton>
        ))}
      </ExampleQueries>

      <PlaygroundContainer>
        <QuerySection>
          <SectionTitle>Query / Mutation</SectionTitle>
          <QueryEditor
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Write your GraphQL query or mutation here..."
          />
          
          <SectionTitle style={{ marginTop: '1rem' }}>Variables (JSON)</SectionTitle>
          <VariablesEditor
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder='{"key": "value"}'
          />

          <ButtonContainer>
            <ExecuteButton onClick={handleExecute} disabled={loading || !query.trim()}>
              {loading ? 'Executing...' : 'Execute'}
            </ExecuteButton>
            <ClearButton onClick={handleClear}>
              Clear
            </ClearButton>
          </ButtonContainer>
        </QuerySection>

        <ResultSection>
          <SectionTitle>Result</SectionTitle>
          <ResultContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {loading && <LoadingIndicator>Executing query...</LoadingIndicator>}
            {result && (
              <SyntaxHighlighter
                language="json"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  height: '100%',
                  fontSize: '14px'
                }}
              >
                {JSON.stringify(result, null, 2)}
              </SyntaxHighlighter>
            )}
            {!result && !loading && !error && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: 'var(--text-secondary)' 
              }}>
                Execute a query to see results here
              </div>
            )}
          </ResultContainer>
        </ResultSection>
      </PlaygroundContainer>
    </Container>
  );
};

export default Playground;