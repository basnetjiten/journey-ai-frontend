import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Snackbar
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import ChatInterface from './ChatInterface';
import EmbeddingInterface from './EmbeddingInterface';
import SearchInterface from './SearchInterface';
import ApiService from '../services/api';
import { HealthResponse } from '../types/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSampleData, setIsLoadingSampleData] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await ApiService.getHealth();
      setHealthStatus(health);
      setError(null);
    } catch (err) {
      setError('Failed to connect to API server. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuickLoadSampleData = async () => {
    setIsLoadingSampleData(true);
    try {
      const response = await fetch('https://journey-ai-webservice.onrender.com/api/v1/quick-load-sample-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: `✅ Successfully loaded ${result.summary.successful} balloon vendor records!`,
          severity: 'success'
        });
      } else {
        throw new Error(result.error || 'Failed to load sample data');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `❌ Error: ${error instanceof Error ? error.message : 'Failed to load sample data'}`,
        severity: 'error'
      });
    } finally {
      setIsLoadingSampleData(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusColor = () => {
    if (isLoading) return 'warning';
    if (error) return 'error';
    return 'success';
  };

  const getStatusText = () => {
    if (isLoading) return 'Connecting...';
    if (error) return 'Disconnected';
    return 'Connected';
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Connecting to API...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <BotIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Journey-AI
          </Typography>
          <Chip
            label={getStatusText()}
            color={getStatusColor()}
            size="small"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Toolbar>
      </AppBar>

      {/* Connection Error */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
          <br />
          <strong>Make sure your backend server is running on http://localhost:3000</strong>
        </Alert>
      )}

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flex: 1, py: 2 }}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="main navigation tabs"
              sx={{ px: 2 }}
            >
              <Tab
                icon={<DashboardIcon />}
                label="Dashboard"
                iconPosition="start"
              />
              <Tab
                icon={<UploadIcon />}
                label="Upload Documents"
                iconPosition="start"
              />
              <Tab
                icon={<SearchIcon />}
                label="Search"
                iconPosition="start"
              />
              <Tab
                icon={<BotIcon />}
                label="AI Chat"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                  Welcome to Journey-AI
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Upload Documents
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Process JSON documents and create embeddings for semantic search
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Semantic Search
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Search through your documents using natural language queries
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <BotIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Chatbot
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ask questions and get intelligent responses based on your data
                    </Typography>
                  </Paper>
                </Box>

                {/* Quick Load Sample Data Section */}
                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🎈 Quick Load Sample Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Generate and upload 20 random balloon vendor records with comprehensive business data for testing and demonstration.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={isLoadingSampleData ? <CircularProgress size={20} /> : <PlayIcon />}
                    onClick={handleQuickLoadSampleData}
                    disabled={isLoadingSampleData}
                    sx={{ mr: 2 }}
                  >
                    {isLoadingSampleData ? 'Loading Sample Data...' : 'Quick Load Sample Data'}
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    This will create 20 diverse balloon vendor profiles with business metrics, financial data, and operational details.
                  </Typography>
                </Paper>

                {healthStatus && (
                  <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      System Status
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Chip label={`Status: ${healthStatus.status}`} color="success" />
                      <Chip label={`Uptime: ${Math.floor(healthStatus.uptime / 60)} minutes`} />
                      <Chip label={`Version: ${healthStatus.version}`} />
                    </Box>
                  </Paper>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <EmbeddingInterface />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <SearchInterface />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <ChatInterface />
            </TabPanel>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 