import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { GET_USERS, CREATE_USER } from '../graphql/queries';
import { User, CreateUserInput } from '../types';

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

const CreateUserSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CreateUserForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  resize: vertical;
  min-height: 80px;
`;

const CreateButton = styled.button`
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

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const UserCard = styled.div`
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

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const UserEmail = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const UserBio = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const JoinDate = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ViewProfileLink = styled(Link)`
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

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  background-color: ${({ theme }) => theme.colors.success}10;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Users: React.FC = () => {
  const [formData, setFormData] = useState<CreateUserInput>({
    name: '',
    email: '',
    username: '',
    bio: '',
    avatar: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        variables: { input: formData },
        refetchQueries: [{ query: GET_USERS }]
      });
      setFormData({ name: '', email: '', username: '', bio: '', avatar: '' });
      setSuccessMessage('User created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Users</Title>
        <Description>
          Manage users and see GraphQL mutations in action. Create new users and explore 
          how GraphQL handles data relationships and queries.
        </Description>
      </Header>

      <CreateUserSection>
        <h3 style={{ marginBottom: '1rem' }}>Create New User</h3>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        <CreateUserForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter user name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email address"
            />
          </FormGroup>

          <FormGroup>
            <Label>Username *</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter username"
            />
          </FormGroup>

          <FormGroup>
            <Label>Avatar URL</Label>
            <Input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </FormGroup>

          <FormGroup style={{ gridColumn: '1 / -1' }}>
            <Label>Bio</Label>
            <TextArea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
            />
          </FormGroup>
        </CreateUserForm>
        
        <CreateButton type="submit" disabled={creating || !formData.name || !formData.email || !formData.username}>
          {creating ? 'Creating...' : 'Create User'}
        </CreateButton>
      </CreateUserSection>

      {loading ? (
        <LoadingSpinner>
          <div className="loading" />
        </LoadingSpinner>
      ) : error ? (
        <ErrorMessage>Error loading users: {error.message}</ErrorMessage>
      ) : data && (
        <UsersGrid>
          {data.users.map((user) => (
            <UserCard key={user.id}>
              <UserHeader>
                <Avatar 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                  alt={user.name} 
                />
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
              </UserHeader>

              {user.bio && <UserBio>{user.bio}</UserBio>}

              <UserStats>
                <StatItem>
                  <StatValue>{user.posts?.length || 0}</StatValue>
                  <StatLabel>Posts</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{user.comments?.length || 0}</StatValue>
                  <StatLabel>Comments</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>
                    {user.posts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0}
                  </StatValue>
                  <StatLabel>Likes</StatLabel>
                </StatItem>
              </UserStats>

              <UserFooter>
                <JoinDate>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </JoinDate>
                <ViewProfileLink to={`/users/${user.id}`}>
                  View Profile →
                </ViewProfileLink>
              </UserFooter>
            </UserCard>
          ))}
        </UsersGrid>
      )}
    </Container>
  );
};

export default Users;