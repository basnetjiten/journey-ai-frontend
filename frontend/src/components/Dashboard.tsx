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
  Snackbar
} from '@mui/material';
import {
  SmartToy as BotIcon,
  // Upload as UploadIcon,
  // Search as SearchIcon,
  // Dashboard as DashboardIcon,
} from '@mui/icons-material';
import ChatInterface from './ChatInterface';
// import EmbeddingInterface from './EmbeddingInterface';
// import SearchInterface from './SearchInterface';
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info',
  });

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
              {/* Uncomment below if you want to show other tabs */}
              {/*
              <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
              <Tab icon={<UploadIcon />} label="Upload" iconPosition="start" />
              <Tab icon={<SearchIcon />} label="Search" iconPosition="start" />
              */}
              <Tab icon={<BotIcon />} label="AI Chat" iconPosition="start" />
            </Tabs>
          </Box>

          {/* Chat Tab Only */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                  Ask anything about balloon vendors 🎈
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Try asking things like:
                  <ul>
                    <li>“What is the daily visitory of vendor?”</li>
                    <li>“Who has the highest customer rating?”</li>
                    <li>“What is the average pricing for balloon arches?”</li>
                  </ul>
                </Typography>
                <ChatInterface />
              </Box>
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
