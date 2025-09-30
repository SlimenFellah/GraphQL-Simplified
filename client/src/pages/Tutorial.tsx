import React, { useState } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.125rem;
`;

const NavigationTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  border-bottom-color: ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const SubTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const Paragraph = styled.p`
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const CodeBlock = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const ComparisonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const ComparisonCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ComparisonTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '✓';
    color: ${({ theme }) => theme.colors.success};
    font-weight: bold;
  }
`;

const HighlightBox = styled.div`
  background-color: ${({ theme }) => theme.colors.primary}10;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  border-radius: 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0;
`;

const ExampleContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const tutorialSections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <SectionTitle>What is GraphQL?</SectionTitle>
        <Paragraph>
          GraphQL is a query language for APIs and a runtime for executing those queries with your existing data. 
          It provides a complete and understandable description of the data in your API, gives clients the power 
          to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables 
          powerful developer tools.
        </Paragraph>

        <SubTitle>Key Benefits</SubTitle>
        <FeatureList>
          <FeatureItem>Ask for what you need, get exactly that</FeatureItem>
          <FeatureItem>Get many resources in a single request</FeatureItem>
          <FeatureItem>Describe what's possible with a type system</FeatureItem>
          <FeatureItem>Evolve your API without versions</FeatureItem>
          <FeatureItem>Bring your own data and code</FeatureItem>
        </FeatureList>

        <ComparisonContainer>
          <ComparisonCard>
            <ComparisonTitle>REST API</ComparisonTitle>
            <CodeBlock>
              <SyntaxHighlighter language="javascript" style={tomorrow}>
{`// Multiple requests needed
GET /users/1
GET /users/1/posts
GET /posts/1/comments

// Over-fetching data
{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "phone": "123-456-7890", // Not needed
  "address": {...}, // Not needed
  "posts": [...]
}`}
              </SyntaxHighlighter>
            </CodeBlock>
          </ComparisonCard>

          <ComparisonCard>
            <ComparisonTitle>GraphQL</ComparisonTitle>
            <CodeBlock>
              <SyntaxHighlighter language="graphql" style={tomorrow}>
{`// Single request
query {
  user(id: 1) {
    name
    posts {
      title
      comments {
        content
        author {
          name
        }
      }
    }
  }
}

// Exact data needed
{
  "user": {
    "name": "John",
    "posts": [...]
  }
}`}
              </SyntaxHighlighter>
            </CodeBlock>
          </ComparisonCard>
        </ComparisonContainer>
      </>
    )
  },
  {
    id: 'queries',
    title: 'Queries',
    content: (
      <>
        <SectionTitle>GraphQL Queries</SectionTitle>
        <Paragraph>
          Queries are how you fetch data in GraphQL. They allow you to specify exactly what data you need, 
          including nested relationships, in a single request.
        </Paragraph>

        <SubTitle>Basic Query</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`query {
  users {
    id
    name
    email
  }
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>Query with Arguments</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`query {
  user(id: "1") {
    name
    email
    posts {
      title
      published
    }
  }
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>Query with Variables</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`query GetUser($userId: ID!) {
  user(id: $userId) {
    name
    email
    posts(filter: { published: true }) {
      title
      createdAt
    }
  }
}

# Variables
{
  "userId": "1"
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <HighlightBox>
          <strong>Pro Tip:</strong> Use variables instead of hardcoding values in your queries. 
          This makes your queries reusable and helps prevent injection attacks.
        </HighlightBox>
      </>
    )
  },
  {
    id: 'mutations',
    title: 'Mutations',
    content: (
      <>
        <SectionTitle>GraphQL Mutations</SectionTitle>
        <Paragraph>
          Mutations are used to modify data on the server. They can create, update, or delete data, 
          and they return the modified data so you can update your client-side cache.
        </Paragraph>

        <SubTitle>Creating Data</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    createdAt
  }
}

# Variables
{
  "input": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "bio": "GraphQL developer"
  }
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>Updating Data</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
  updatePost(id: $id, input: $input) {
    id
    title
    content
    updatedAt
  }
}

# Variables
{
  "id": "1",
  "input": {
    "title": "Updated Title",
    "content": "Updated content..."
  }
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>Multiple Operations</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`mutation {
  likePost(id: "1") {
    id
    likes
  }
  
  createComment(input: {
    postId: "1"
    content: "Great post!"
  }) {
    id
    content
    createdAt
  }
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <HighlightBox>
          <strong>Important:</strong> Unlike queries, mutations are executed sequentially, 
          not in parallel. This ensures data consistency when multiple operations depend on each other.
        </HighlightBox>
      </>
    )
  },
  {
    id: 'schema',
    title: 'Schema & Types',
    content: (
      <>
        <SectionTitle>GraphQL Schema & Type System</SectionTitle>
        <Paragraph>
          The schema defines the structure of your API. It describes what queries and mutations are available, 
          what types of data they return, and how different types relate to each other.
        </Paragraph>

        <SubTitle>Scalar Types</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`# Built-in scalar types
String    # UTF-8 character sequence
Int       # 32-bit integer
Float     # Double-precision floating-point
Boolean   # true or false
ID        # Unique identifier

# Custom scalar types
scalar DateTime
scalar Email
scalar URL`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>Object Types</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`type User {
  id: ID!
  name: String!
  email: String!
  bio: String
  avatar: String
  createdAt: DateTime!
  posts: [Post!]!
  comments: [Comment!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  excerpt: String
  published: Boolean!
  likes: Int!
  tags: [String!]!
  createdAt: DateTime!
  updatedAt: DateTime!
  author: User!
  comments: [Comment!]!
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>Input Types</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`input CreateUserInput {
  name: String!
  email: String!
  bio: String
  avatar: String
}

input PostFilter {
  published: Boolean
  authorId: ID
  tags: [String!]
  search: String
}

input PostSort {
  field: PostSortField!
  order: SortOrder!
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>Enums</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`enum PostSortField {
  CREATED_AT
  UPDATED_AT
  TITLE
  LIKES
}

enum SortOrder {
  ASC
  DESC
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <HighlightBox>
          <strong>Type Modifiers:</strong>
          <br />• <code>String!</code> - Non-nullable string (required)
          <br />• <code>[String!]!</code> - Non-nullable array of non-nullable strings
          <br />• <code>[String]</code> - Nullable array of nullable strings
        </HighlightBox>
      </>
    )
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    content: (
      <>
        <SectionTitle>GraphQL Best Practices</SectionTitle>
        
        <SubTitle>1. Design Your Schema First</SubTitle>
        <Paragraph>
          Start with your schema design before implementing resolvers. Think about the data relationships 
          and what operations your clients will need.
        </Paragraph>

        <SubTitle>2. Use Descriptive Names</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`# Good
type User {
  id: ID!
  displayName: String!
  emailAddress: String!
  profilePicture: String
  joinedAt: DateTime!
}

# Avoid
type User {
  id: ID!
  name: String!
  email: String!
  pic: String
  created: String!
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>3. Handle Errors Gracefully</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="javascript" style={tomorrow}>
{`// In your resolver
const resolvers = {
  Query: {
    user: async (_, { id }) => {
      try {
        const user = await getUserById(id);
        if (!user) {
          throw new Error(\`User with ID \${id} not found\`);
        }
        return user;
      } catch (error) {
        throw new Error(\`Failed to fetch user: \${error.message}\`);
      }
    }
  }
};`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>4. Implement Pagination</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`type PostConnection {
  posts: [Post!]!
  totalCount: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type Query {
  posts(
    filter: PostFilter
    sort: PostSort
    pagination: PaginationInput
  ): PostConnection!
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <SubTitle>5. Use Fragments for Reusability</SubTitle>
        <ExampleContainer>
          <CodeBlock>
            <SyntaxHighlighter language="graphql" style={tomorrow}>
{`fragment UserInfo on User {
  id
  name
  email
  avatar
}

query GetPosts {
  posts {
    id
    title
    author {
      ...UserInfo
    }
    comments {
      content
      author {
        ...UserInfo
      }
    }
  }
}`}
            </SyntaxHighlighter>
          </CodeBlock>
        </ExampleContainer>

        <FeatureList>
          <FeatureItem>Always validate input data</FeatureItem>
          <FeatureItem>Implement proper authentication and authorization</FeatureItem>
          <FeatureItem>Use DataLoader to prevent N+1 queries</FeatureItem>
          <FeatureItem>Cache frequently accessed data</FeatureItem>
          <FeatureItem>Monitor query complexity and depth</FeatureItem>
          <FeatureItem>Provide clear error messages</FeatureItem>
          <FeatureItem>Document your schema with descriptions</FeatureItem>
        </FeatureList>
      </>
    )
  }
];

const Tutorial: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const currentSection = tutorialSections.find(section => section.id === activeSection);

  return (
    <Container>
      <Header>
        <Title>GraphQL Tutorial</Title>
        <Description>
          Learn GraphQL concepts through interactive examples and practical demonstrations.
        </Description>
      </Header>

      <NavigationTabs>
        {tutorialSections.map((section) => (
          <Tab
            key={section.id}
            $active={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          >
            {section.title}
          </Tab>
        ))}
      </NavigationTabs>

      <Section>
        {currentSection?.content}
      </Section>
    </Container>
  );
};

export default Tutorial;