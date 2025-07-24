import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import ApiService from '../services/api';
import { EmbeddingResponse } from '../types/api';

const EmbeddingInterface: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<EmbeddingResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleData = {
    customer: {
      name: "John Smith",
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        zip: "10001"
      },
      preferences: {
        newsletter: true,
        notifications: false
      }
    },
    product: {
      productId: "PROD-001",
      name: "Smartphone X",
      price: 999.99,
      category: "Electronics",
      specifications: {
        screen: "6.1 inch",
        storage: "128GB",
        color: "Black"
      }
    },
    order: {
      orderId: "ORD-2024-001",
      customerId: "CUST-123",
      items: [
        { productId: "PROD-001", quantity: 2, price: 999.99 },
        { productId: "PROD-002", quantity: 1, price: 299.99 }
      ],
      total: 2299.97,
      status: "pending"
    }
  };

  const handleProcessJson = async () => {
    if (!jsonInput.trim()) {
      setError('Please enter valid JSON data');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const jsonData = JSON.parse(jsonInput);
      const response = await ApiService.createEmbedding(jsonData);
      
      setLastResponse(response);
      setSuccess('Document processed successfully!');
      setJsonInput('');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your input.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to process document');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessExample = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await ApiService.processExample();
      setLastResponse(response);
      setSuccess('Example document processed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process example');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = (type: keyof typeof sampleData) => {
    setJsonInput(JSON.stringify(sampleData[type], null, 2));
    setError(null);
    setSuccess(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatMetadata = (metadata: any) => {
    return Object.entries(metadata).map(([key, value]) => (
      <Chip
        key={key}
        label={`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
        size="small"
        variant="outlined"
        sx={{ m: 0.5 }}
      />
    ));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Document Processing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload JSON documents to create embeddings for semantic search
        </Typography>
      </Paper>

      {/* Sample Data Buttons */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Load Sample Data:
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleLoadSample('customer')}
          >
            Customer Record
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleLoadSample('product')}
          >
            Product Catalog
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleLoadSample('order')}
          >
            E-commerce Order
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleProcessExample}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={16} /> : <AddIcon />}
          >
            Process Example
          </Button>
        </Box>
      </Paper>

      {/* JSON Input */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" gutterBottom>
            JSON Document Input
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, p: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={12}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter JSON data here..."
            variant="outlined"
            disabled={isProcessing}
            sx={{ fontFamily: 'monospace' }}
          />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            onClick={handleProcessJson}
            disabled={!jsonInput.trim() || isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <UploadIcon />}
            fullWidth
          >
            {isProcessing ? 'Processing...' : 'Process Document'}
          </Button>
        </Box>
      </Paper>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Response Details */}
      {lastResponse && (
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1">
              Processing Results
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy response"}>
              <IconButton
                size="small"
                onClick={() => copyToClipboard(JSON.stringify(lastResponse, null, 2))}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">
                Document ID: {lastResponse.documentId}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Content Hash:
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                    {lastResponse.contentHash}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Text Representation:
                  </Typography>
                  <Typography variant="body2" sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                    {lastResponse.textRepresentation}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Embedding Dimension:
                  </Typography>
                  <Chip label={lastResponse.embeddingDimension} size="small" />
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Metadata:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {formatMetadata(lastResponse.metadata)}
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}
    </Box>
  );
};

export default EmbeddingInterface; 