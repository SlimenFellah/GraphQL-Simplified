/**
 * GraphQL Simplified - Client
 * 
 * A modern React application with GraphQL integration, TypeScript, and Styled Components
 * 
 * Developed and maintained by Slimene Fellah
 * Portfolio: https://www.slimenefellah.dev/
 * Available for freelance work
 */

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import client from './apollo-client';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import GraphQLPlayground from './pages/Playground';
import Tutorial from './pages/Tutorial';
import Stats from './pages/Stats';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/playground" element={<GraphQLPlayground />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
