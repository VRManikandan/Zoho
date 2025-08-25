import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header 
        onToggleSidebar={toggleSidebar}
        currentPath={location.pathname}
      />
      <Sidebar 
        collapsed={sidebarCollapsed} 
        currentPath={location.pathname}
        onNavigate={navigate}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          ml: sidebarCollapsed ? 0 : '250px',
          transition: 'margin-left 0.3s',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
