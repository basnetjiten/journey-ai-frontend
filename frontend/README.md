# LangChain MongoDB Embeddings - Frontend

A modern React-based user interface for the LangChain MongoDB Embeddings API.

## Features

- **Document Upload**: Upload and process JSON documents with intelligent text conversion
- **Semantic Search**: Search through documents using natural language queries
- **AI Chatbot**: Interactive chatbot with RAG (Retrieval-Augmented Generation) capabilities
- **Real-time Status**: Monitor API connection and system health
- **Responsive Design**: Works on desktop and mobile devices
- **Material-UI**: Modern, accessible UI components

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:3000" > .env
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3001`.

### Building for Production

```bash
npm run build
```

## Usage

### Dashboard
The main dashboard provides an overview of the system status and quick access to all features.

### Upload Documents
1. Navigate to the "Upload Documents" tab
2. Use the sample data buttons to load example JSON
3. Or paste your own JSON data
4. Click "Process Document" to create embeddings

### Search
1. Go to the "Search" tab
2. Enter your search query in natural language
3. Adjust result limits and scoring options
4. View detailed results with similarity scores

### AI Chat
1. Open the "AI Chat" tab
2. Ask questions about your uploaded documents
3. View source attribution and metadata
4. Continue conversations with context

## API Integration

The frontend communicates with the backend API through the `ApiService` class:

- **Health Check**: `/health`
- **Document Processing**: `/api/v1/embed`
- **Search**: `/api/v1/search`
- **Chat**: `/api/v1/chat`
- **Conversations**: `/api/v1/conversations`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main application layout
│   │   ├── ChatInterface.tsx      # AI chatbot interface
│   │   ├── EmbeddingInterface.tsx # Document upload interface
│   │   └── SearchInterface.tsx    # Search interface
│   ├── services/
│   │   └── api.ts                 # API service layer
│   ├── types/
│   │   └── api.ts                 # TypeScript interfaces
│   └── App.tsx                    # Main app component
├── public/
│   └── index.html                 # HTML template
└── package.json                   # Dependencies and scripts
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation (if needed)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
