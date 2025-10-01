import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 1.2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CardContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
  }

  &.prev {
    left: -80px;
  }

  &.next {
    right: -80px;
  }

  @media (max-width: 768px) {
    &.prev {
      left: -60px;
    }
    &.next {
      right: -60px;
    }
  }
`;

const ComparisonCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 600px;
  perspective: 1000px;
  cursor: pointer;
  overflow: visible;
`;

const CardInner = styled.div<{ $isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${({ $isFlipped }) => $isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
`;

const CardBack = styled(CardFace)`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transform: rotateY(180deg);
  border: 2px solid ${({ theme }) => theme.colors.border};
  overflow: visible;
`;

const CardNumber = styled.div`
  position: absolute;
  top: -15px;
  left: 30px;
  background: ${({ theme }) => theme.colors.warning};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 100;
`;

const CardTitle = styled.h2`
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1.8rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-grow: 1;
`;

const FlipHint = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: auto;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  flex: 1;
  overflow: visible;
  min-height: 400px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
    min-height: 350px;
  }
`;

const ComparisonSection = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  overflow: visible;
  height: 100%;
`;

const SectionTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.sm};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  overflow: auto;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  flex: 1;
  max-height: 300px;
  min-height: 150px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    max-height: 250px;
    min-height: 120px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PaginationDot = styled.button<{ $active: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  padding: 0;
  margin: 0;
  outline: none;
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.2);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ProgressText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0 ${({ theme }) => theme.spacing.md};
`;

const RestVsGraphQL: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    if (currentCard < comparisonData.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const goToCard = (index: number) => {
    setCurrentCard(index);
    setIsFlipped(false);
  };

  const toggleCard = () => {
    setIsFlipped(!isFlipped);
  };

  const comparisonData = [
    {
      title: "Client-driven vs Server-driven",
      description: "Who controls what data gets returned? In REST, the server decides. In GraphQL, the client has the power to request exactly what they need.",
      restCode: `// REST: Server decides what to return
GET /users/1
// Returns: { id, name, email, avatar, bio, createdAt, ... }

GET /users/1/profile  
// Returns: { name, avatar, bio }

GET /users/1/details
// Returns: { name, posts: [...], comments: [...] }`,
      graphqlCode: `# GraphQL: Client decides what to get
query {
  user(id: 1) {
    name        # Only what I need
    avatar      # No over-fetching
  }
}

# Same endpoint, different needs:
query {
  user(id: 1) {
    name
    bio
    posts {
      title
    }
  }
}`,
      explanation: "With REST, you need multiple endpoints for different use cases. GraphQL uses one endpoint with flexible queries."
    },
    {
      title: "Multiple Resources in One Request",
      description: "REST often requires multiple round-trips to get related data. GraphQL can fetch everything in a single request, reducing network overhead.",
      restCode: `// REST: Multiple requests needed
GET /users/1
// { id: 1, name: "John" }

GET /users/1/posts  
// [{ id: 123, title: "Hello World" }]

GET /posts/123/comments
// [{ id: 1, content: "Great post!" }]

// 3 network requests = slower`,
      graphqlCode: `# GraphQL: One request gets it all
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

# Result: All data in one response!`,
      explanation: "GraphQL eliminates the N+1 query problem by allowing clients to specify exactly what related data they need upfront."
    },
    {
      title: "Strong Typing and Developer Tools",
      description: "GraphQL's built-in type system enables powerful developer tools like autocomplete, validation, and automatic code generation.",
      restCode: `// REST: No built-in type information
GET /users/1
// What fields exist? What are their types?
// Need to check documentation or guess

// Swagger/OpenAPI helps but isn't built-in
{
  "name": "string",
  "age": "number", 
  "posts": "array"  // Array of what?
}`,
      graphqlCode: `# GraphQL: Built-in type system
type User {
  id: ID!
  name: String!
  age: Int
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

# IDE knows all types and provides:
# - Autocomplete
# - Validation  
# - Error checking`,
      explanation: "GraphQL's schema acts as a contract between client and server, enabling better tooling and catching errors at development time."
    },
    {
      title: "API Evolution Without Versioning",
      description: "REST APIs often need versioning when changes occur. GraphQL allows smooth evolution by adding fields without breaking existing queries.",
      restCode: `// REST: Breaking changes need new versions
GET /v1/users/1
// { id, name, email }

GET /v2/users/1  
// { id, name, email, avatar, bio }
// v1 clients break if we change the response

// Need to maintain multiple versions:
// /v1/users, /v2/users, /v3/users...`,
      graphqlCode: `# GraphQL: Additive changes don't break
type User {
  id: ID!
  name: String!
  email: String!
  # Add new fields safely:
  avatar: String      # Old queries still work
  bio: String         # Only new queries use these
  preferences: UserPrefs
}

# Old query still works:
query { user(id: 1) { name email } }

# New query uses new fields:
query { user(id: 1) { name avatar bio } }`,
      explanation: "GraphQL's additive nature means you can evolve your API without breaking existing clients, reducing maintenance overhead."
    },
    {
      title: "Multiple Data Sources Integration",
      description: "GraphQL can aggregate data from multiple sources (databases, APIs, microservices) into a single, unified interface for clients.",
      restCode: `// REST: Multiple services = Multiple calls
GET /api/users/1           // User service
GET /api/billing/user/1    // Billing service  
GET /api/recommendations/1 // ML service
GET /api/social/friends/1  // Social service

// Client needs to:
// 1. Make 4 separate requests
// 2. Handle 4 different response formats
// 3. Combine data client-side
// 4. Handle partial failures`,
      graphqlCode: `# GraphQL: One query, multiple sources
query {
  user(id: 1) {
    # From User DB (Postgres)
    name
    email
    
    # From Billing API (Stripe)
    subscription {
      plan
      status
    }
    
    # From ML Service
    recommendations {
      title
      score
    }
    
    # From Social Graph (Neo4j)
    friends {
      name
      avatar
    }
  }
}`,
      explanation: "GraphQL acts as a data layer that can fetch from SQL databases, NoSQL stores, REST APIs, microservices, and more - all unified in one query."
    }
  ];

  const currentComparison = comparisonData[currentCard];

  return (
    <Container>
      <Title>REST vs GraphQL</Title>
      <Subtitle>
        GraphQL isn't replacing your database - it's revolutionizing how clients communicate with your API. 
        Navigate through these progressive examples to understand the key differences.
      </Subtitle>
      
      <CardContainer>
        <NavigationButton 
          className="prev"
          onClick={prevCard}
          disabled={currentCard === 0}
        >
          ←
        </NavigationButton>

        <ComparisonCard onClick={toggleCard}>
          <CardInner $isFlipped={isFlipped}>
            <CardFront>
              <CardNumber>{currentCard + 1}</CardNumber>
              <CardTitle>{currentComparison.title}</CardTitle>
              <CardDescription>{currentComparison.description}</CardDescription>
              <FlipHint>👆 Click to see code examples</FlipHint>
            </CardFront>
            
            <CardBack>
              <CardNumber>{currentCard + 1}</CardNumber>
              <CardTitle>{currentComparison.title}</CardTitle>
              
              <ComparisonGrid>
                <ComparisonSection>
                  <SectionTitle>🔴 REST Approach</SectionTitle>
                  <CodeBlock>{currentComparison.restCode}</CodeBlock>
                </ComparisonSection>
                
                <ComparisonSection>
                  <SectionTitle>🟢 GraphQL Approach</SectionTitle>
                  <CodeBlock>{currentComparison.graphqlCode}</CodeBlock>
                </ComparisonSection>
              </ComparisonGrid>
              
              <CardDescription style={{ fontSize: '0.9rem', marginTop: 'auto', flexShrink: 0 }}>
                💡 <strong>Key Insight:</strong> {currentComparison.explanation}
              </CardDescription>
              
              <FlipHint>👆 Click to flip back</FlipHint>
            </CardBack>
          </CardInner>
        </ComparisonCard>

        <NavigationButton 
          className="next"
          onClick={nextCard}
          disabled={currentCard === comparisonData.length - 1}
        >
          →
        </NavigationButton>
      </CardContainer>

      <PaginationContainer>
        {comparisonData.map((_, index) => (
          <PaginationDot
            key={index}
            $active={index === currentCard}
            onClick={() => goToCard(index)}
          />
        ))}
      </PaginationContainer>
    </Container>
  );
};

export default RestVsGraphQL;