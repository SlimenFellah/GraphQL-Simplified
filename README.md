# GraphQL Simplified

A modern, full-stack GraphQL application built with React and Node.js, demonstrating best practices for GraphQL development with a clean, intuitive interface and PostgreSQL database integration.

## 🚀 Features

- **Modern GraphQL Server**: Built with Apollo Server and GraphQL
- **PostgreSQL Database**: Robust data persistence with PostgreSQL
- **React Frontend**: Modern React application with TypeScript support
- **Real-time Data**: Efficient data fetching with Apollo Client
- **Responsive Design**: Beautiful, mobile-first UI with styled-components
- **Type Safety**: Full TypeScript integration for both frontend and backend
- **Interactive Playground**: Built-in GraphQL Playground for API exploration
- **Database Seeding**: Automated database setup with sample data

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **GraphQL** - Query language and runtime
- **Apollo Server** - GraphQL server implementation
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **JavaScript** - Server-side logic

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Apollo Client** - GraphQL client with caching
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing

## 📁 Project Structure

```
graphql-simplified/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── graphql/        # GraphQL queries and mutations
│   │   ├── styles/         # Global styles and themes
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── server/                 # GraphQL backend server
│   ├── index.js           # Server entry point
│   ├── schema.js          # GraphQL schema definitions
│   ├── resolvers.js       # GraphQL resolvers
│   ├── database.js        # Database connection and utilities
│   ├── schema.sql         # Database schema definition
│   └── seed.js            # Database seeding script
├── .env                   # Environment variables
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Database Setup

1. **Install PostgreSQL**
   - Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
   - Make sure PostgreSQL service is running

2. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   
   # GraphQL Configuration
   GRAPHQL_ENDPOINT=/graphql
   GRAPHQL_PLAYGROUND=true
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=graphql_simplified
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd graphql-simplified
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Setup the database**
   ```bash
   # From the root directory
   node server/seed.js
   ```
   This will:
   - Create the `graphql_simplified` database if it doesn't exist
   - Set up the database schema (users, posts, comments tables)
   - Populate the database with sample data

### Running the Application

1. **Start the GraphQL server**
   ```bash
   # From the root directory
   npm run server
   ```
   The server will be available at `http://localhost:4000/graphql`

2. **Start the React client**
   ```bash
   # From the root directory (in a new terminal)
   cd client
   npm start
   ```
   The client will be available at `http://localhost:3000`

## 🎯 Available Scripts

### Root Directory
- `npm run server` - Start the GraphQL server
- `npm run client` - Start the React development server

### Server Directory
- `node seed.js` - Initialize and seed the database

### Client Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User profiles and authentication data
- **posts**: Blog posts with content, metadata, and relationships
- **comments**: Comments on posts with threading support

Key features:
- UUID primary keys for all entities
- Foreign key relationships with cascading deletes
- Automatic timestamp management with triggers
- Indexed fields for optimal query performance
- Support for tags, likes, and hierarchical comments

## 📖 API Documentation

The GraphQL API provides the following main types:

- **User**: User management with profiles and authentication
- **Post**: Content management with CRUD operations
- **Query**: Read operations for fetching data
- **Mutation**: Write operations for creating/updating data

Visit `http://localhost:4000/graphql` when the server is running to explore the API with GraphQL Playground.

## 🎨 Features Overview

### Pages
- **Home**: Welcome page with application overview
- **Posts**: Browse and manage blog posts
- **Users**: User management and profiles
- **GraphQL Playground**: Interactive API explorer
- **Tutorial**: Learn GraphQL concepts
- **Stats**: Application statistics and metrics

### Components
- Responsive navigation header
- Reusable UI components
- Themed styling system
- Type-safe GraphQL integration

## 🤝 Contributing

This is an open-source project! Contributions are welcome. Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Developed and maintained by [Slimene Fellah](https://www.slimenefellah.dev/)**

Computer Science Engineering Student specializing in Full-stack Web & AI development. Building scalable applications with modern technologies and AI integration.

🌐 **Available for freelance work** - [Contact me](https://www.slimenefellah.dev/)

---

*This project demonstrates modern GraphQL development practices and serves as a learning resource for developers interested in building full-stack applications with GraphQL, React, and Node.js.*