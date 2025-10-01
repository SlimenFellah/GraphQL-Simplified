import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import styled from 'styled-components';

// GraphQL introspection query to fetch schema information
const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      types {
        name
        kind
        description
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
          description
          args {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
            description
          }
        }
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
          description
        }
        enumValues {
          name
          description
        }
      }
    }
  }
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TypeCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TypeName = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 1.2rem;
`;

const TypeKind = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const TypeDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  font-size: 0.9rem;
`;

const FieldsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const FieldItem = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}40;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
`;

const FieldName = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 500;
`;

const FieldType = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  margin: ${({ theme }) => theme.spacing.lg};
`;

const CloseButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.error}10;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

interface GraphQLType {
  name: string;
  kind: string;
  description?: string;
  fields?: Array<{
    name: string;
    type: {
      name?: string;
      kind: string;
      ofType?: {
        name?: string;
        kind: string;
      };
    };
    description?: string;
    args?: Array<{
      name: string;
      type: {
        name?: string;
        kind: string;
        ofType?: {
          name?: string;
          kind: string;
        };
      };
      description?: string;
    }>;
  }>;
  inputFields?: Array<{
    name: string;
    type: {
      name?: string;
      kind: string;
      ofType?: {
        name?: string;
        kind: string;
      };
    };
    description?: string;
  }>;
  enumValues?: Array<{
    name: string;
    description?: string;
  }>;
}

const SchemaExplorer: React.FC = () => {
  const [selectedType, setSelectedType] = useState<GraphQLType | null>(null);
  const { loading, error, data } = useQuery(INTROSPECTION_QUERY);

  const formatTypeName = (type: any): string => {
    if (!type) return 'Unknown';
    
    if (type.kind === 'NON_NULL') {
      return `${formatTypeName(type.ofType)}!`;
    }
    if (type.kind === 'LIST') {
      return `[${formatTypeName(type.ofType)}]`;
    }
    return type.name || type.kind || 'Unknown';
  };

  const getUserDefinedTypes = (types: GraphQLType[]) => {
    return types.filter(type => 
      !type.name.startsWith('__') && // Filter out introspection types
      !['String', 'Int', 'Float', 'Boolean', 'ID'].includes(type.name) // Filter out built-in scalars
    );
  };

  if (loading) return <LoadingSpinner>Loading schema...</LoadingSpinner>;
  if (error) return <ErrorMessage>Error loading schema: {error.message}</ErrorMessage>;

  const userTypes = getUserDefinedTypes(data.__schema.types);

  return (
    <Container>
      <Header>
        <Title>GraphQL Schema Explorer</Title>
        <Description>
          Explore your GraphQL API's type system. Click on any type to see its detailed structure.
        </Description>
      </Header>

      <TypeGrid>
        {userTypes.map((type: GraphQLType) => (
          <TypeCard key={type.name} onClick={() => setSelectedType(type)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <TypeName>{type.name}</TypeName>
              <TypeKind>{type.kind}</TypeKind>
            </div>
            {type.description && (
              <TypeDescription>{type.description}</TypeDescription>
            )}
            {type.fields && type.fields.length > 0 && (
              <FieldsList>
                {type.fields.slice(0, 3).map((field) => (
                  <FieldItem key={field.name}>
                    <FieldName>{field.name}</FieldName>: <FieldType>{formatTypeName(field.type)}</FieldType>
                  </FieldItem>
                ))}
                {type.fields.length > 3 && (
                  <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    +{type.fields.length - 3} more fields...
                  </div>
                )}
              </FieldsList>
            )}
          </TypeCard>
        ))}
      </TypeGrid>

      <Modal isOpen={!!selectedType}>
        <ModalContent>
          {selectedType && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <TypeName>{selectedType.name}</TypeName>
                <TypeKind>{selectedType.kind}</TypeKind>
              </div>
              
              {selectedType.description && (
                <TypeDescription>{selectedType.description}</TypeDescription>
              )}

              {selectedType.fields && selectedType.fields.length > 0 && (
                <>
                  <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Fields:</h4>
                  <FieldsList>
                    {selectedType.fields.map((field) => (
                      <div key={field.name} style={{ marginBottom: '1rem' }}>
                        <FieldItem>
                          <FieldName>{field.name}</FieldName>: <FieldType>{formatTypeName(field.type)}</FieldType>
                        </FieldItem>
                        {field.description && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem', paddingLeft: '1rem' }}>
                            {field.description}
                          </div>
                        )}
                        {field.args && field.args.length > 0 && (
                          <div style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                            <strong style={{ fontSize: '0.8rem' }}>Arguments:</strong>
                            {field.args.map((arg) => (
                              <div key={arg.name} style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                <FieldName>{arg.name}</FieldName>: <FieldType>{formatTypeName(arg.type)}</FieldType>
                                {arg.description && <span style={{ color: '#666' }}> - {arg.description}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </FieldsList>
                </>
              )}

              {selectedType.inputFields && selectedType.inputFields.length > 0 && (
                <>
                  <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Input Fields:</h4>
                  <FieldsList>
                    {selectedType.inputFields.map((field) => (
                      <div key={field.name} style={{ marginBottom: '0.5rem' }}>
                        <FieldItem>
                          <FieldName>{field.name}</FieldName>: <FieldType>{formatTypeName(field.type)}</FieldType>
                        </FieldItem>
                        {field.description && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem', paddingLeft: '1rem' }}>
                            {field.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </FieldsList>
                </>
              )}

              {selectedType.enumValues && selectedType.enumValues.length > 0 && (
                <>
                  <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Enum Values:</h4>
                  <FieldsList>
                    {selectedType.enumValues.map((enumValue) => (
                      <div key={enumValue.name} style={{ marginBottom: '0.5rem' }}>
                        <FieldItem>
                          <FieldName>{enumValue.name}</FieldName>
                        </FieldItem>
                        {enumValue.description && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem', paddingLeft: '1rem' }}>
                            {enumValue.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </FieldsList>
                </>
              )}

              <CloseButton onClick={() => setSelectedType(null)}>
                Close
              </CloseButton>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SchemaExplorer;