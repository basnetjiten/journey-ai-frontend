import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  Source as SourceIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import ApiService from '../services/api';
import { ChatResponse, ChatRequest } from '../types/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: any[];
  metadata?: any;
}

interface ChatInterfaceProps {
  conversationId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const chatRequest: ChatRequest = {
        message: inputMessage,
        conversationId: currentConversationId,
        topK: 5,
        similarityThreshold: 0.6
      };

      const response: ChatResponse = await ApiService.chat(chatRequest);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        sources: response.sources,
        metadata: response.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentConversationId(response.conversationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString();
  };

  const renderSources = (sources: any[]) => {
    if (!sources || sources.length === 0) return null;

    return (
      <Accordion sx={{ mt: 1, backgroundColor: '#f5f5f5' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <SourceIcon fontSize="small" />
            <Typography variant="body2">
              Sources ({sources.length})
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {sources.map((source, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%' }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip
                      label={`Score: ${source.similarityScore.toFixed(3)}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {source.metadata?.documentType || 'Unknown'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {source.content.substring(0, 200)}...
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderMetadata = (metadata: any) => {
    if (!metadata) return null;

    return (
      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`${metadata.tokensUsed} tokens`}
          size="small"
          variant="outlined"
        />
        <Chip
          label={`${metadata.processingTime}ms`}
          size="small"
          variant="outlined"
        />
        {metadata.llmProvider && (
          <Chip
            label={`${metadata.llmProvider} (${metadata.llmModel})`}
            size="small"
            variant="outlined"
            color="secondary"
          />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <BotIcon />
            AI Chatbot
          </Typography>
          {currentConversationId && (
            <Chip
              label={`Conversation: ${currentConversationId.substring(0, 8)}...`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Messages */}
      <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              color="text.secondary"
            >
              <BotIcon sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Welcome to the Journey-AI Chatbot!
              </Typography>
              <Typography variant="body2" textAlign="center">
                Ask questions about your stored documents and get intelligent responses.
              </Typography>
            </Box>
          ) : (
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flexDirection: 'column',
                    alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: 2,
                      p: 2,
                      position: 'relative'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {message.role === 'user' ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
                      <Typography variant="body2" color="text.secondary">
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>

                    {message.sources && renderSources(message.sources)}
                    {message.metadata && renderMetadata(message.metadata)}
                  </Box>
                </ListItem>
              ))}
              
              {isLoading && (
                <ListItem sx={{ justifyContent: 'flex-start' }}>
                  <Box
                    sx={{
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <CircularProgress size={20} />
                    <Typography variant="body2">AI is thinking...</Typography>
                  </Box>
                </ListItem>
              )}
              
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your documents..."
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInterface; 