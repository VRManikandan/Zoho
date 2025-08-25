import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon, Person as PersonIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = ({ onToggleSidebar, currentPath }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const getPageTitle = (path) => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/customers': 'Customers',
      '/vendors': 'Vendors',
      '/items': 'Items',
      '/taxes': 'Taxes',
      '/expenses': 'Expenses',
      '/banking': 'Banking',
      '/notifications': 'Notifications',
      '/reminders': 'Reminders',
      '/invoices': 'Invoices',
      '/estimates': 'Estimates',
      '/sales-orders': 'Sales Orders',
      '/purchase-orders': 'Purchase Orders',
      '/bills': 'Bills',
      '/chart-of-accounts': 'Chart of Accounts',
      '/journal-entries': 'Journal Entries',
      '/projects': 'Projects',
      '/time-tracking': 'Time Tracking',
      '/inventory': 'Inventory',
      '/reports': 'Reports',
      '/settings': 'Settings'
    };
    return pathMap[path] || 'ZBooks';
  };


  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            {currentPath === '/dashboard' ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold' }}
          >
            {getPageTitle(currentPath)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {user?.full_name || 'User'}
          </Typography>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
