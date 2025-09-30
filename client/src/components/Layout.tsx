import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <LayoutContainer>
      <Header>
        <Nav>
          <Logo to="/">
            GraphQL Simplified
          </Logo>
          <NavLinks>
            <NavLink to="/" $active={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/posts" $active={isActive('/posts')}>
              Posts
            </NavLink>
            <NavLink to="/users" $active={isActive('/users')}>
              Users
            </NavLink>
            <NavLink to="/playground" $active={isActive('/playground')}>
              Playground
            </NavLink>
            <NavLink to="/tutorial" $active={isActive('/tutorial')}>
              Tutorial
            </NavLink>
            <NavLink to="/stats" $active={isActive('/stats')}>
              Stats
            </NavLink>
          </NavLinks>
        </Nav>
      </Header>
      <Main>
        {children}
      </Main>
      <Footer>
        <FooterContent>
          <p>
            Built with ❤️ using GraphQL, Apollo Server, React, and TypeScript
          </p>
          <p>
            A comprehensive demonstration of GraphQL concepts and best practices
          </p>
        </FooterContent>
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;