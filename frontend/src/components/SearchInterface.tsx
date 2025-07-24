import React, { useState } from 'react';
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
  AccordionDetails,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import ApiService from '../services/api';
import { SearchResult } from '../types/api';

const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [includeScore, setIncludeScore] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await ApiService.searchDocuments(query, limit, includeScore);
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search documents');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
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

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await ApiService.deleteDocument(documentId);
      setResults(prev => prev.filter(result => result.documentId !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const formatSimilarityScore = (score: number) => {
    const percentage = (score * 100).toFixed(1);
    let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
    
    if (score >= 0.8) color = "success";
    else if (score >= 0.6) color = "primary";
    else if (score >= 0.4) color = "warning";
    else color = "error";

    return <Chip label={`${percentage}%`} size="small" color={color} />;
  };

  const renderDocumentContent = (result: SearchResult) => {
    const { originalData, textRepresentation, metadata } = result;
    
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight="bold">
              {metadata?.documentType || 'Document'}
            </Typography>
            {includeScore && formatSimilarityScore(result.similarityScore)}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Original Data:
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#f5f5f5',
                  p: 1,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  maxHeight: 200,
                  overflow: 'auto'
                }}
              >
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(originalData, null, 2)}
                </pre>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Text Representation:
              </Typography>
              <Typography variant="body2" sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                {textRepresentation}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Metadata:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip label={`ID: ${result.documentId.substring(0, 8)}...`} size="small" variant="outlined" />
                <Chip label={`Type: ${metadata?.documentType || 'Unknown'}`} size="small" variant="outlined" />
                <Chip label={`Processed: ${new Date(metadata?.processedAt).toLocaleDateString()}`} size="small" variant="outlined" />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Semantic Search
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Search for documents using natural language queries
        </Typography>
      </Paper>

      {/* Search Controls */}
      <Paper sx={{ p: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your search query..."
            variant="outlined"
            disabled={isSearching}
          />

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Results Limit</InputLabel>
              <Select
                value={limit}
                label="Results Limit"
                onChange={(e) => setLimit(e.target.value as number)}
              >
                <MenuItem value={5}>5 results</MenuItem>
                <MenuItem value={10}>10 results</MenuItem>
                <MenuItem value={20}>20 results</MenuItem>
                <MenuItem value={50}>50 results</MenuItem>
              </Select>
            </FormControl>

                          <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Include Score</InputLabel>
                <Select
                  value={includeScore ? 'true' : 'false'}
                  label="Include Score"
                  onChange={(e) => setIncludeScore(e.target.value === 'true')}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>

            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">
                Search Results ({results.length})
              </Typography>
              <Tooltip title={copied ? "Copied!" : "Copy all results"}>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <List>
              {results.map((result, index) => (
                <ListItem
                  key={result.documentId}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    mb: 2,
                    p: 0
                  }}
                >
                  <Paper sx={{ width: '100%' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle2">
                          Result #{index + 1}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Delete document">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteDocument(result.documentId)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ p: 2 }}>
                      {renderDocumentContent(result)}
                    </Box>
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      )}

      {/* No Results */}
      {!isSearching && results.length === 0 && query && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No results found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search query or check if documents have been uploaded.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SearchInterface; 