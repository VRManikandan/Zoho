import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Description as DescriptionIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Work as WorkIcon,
  Inventory2 as Inventory2Icon,
  Notifications as NotificationsIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingBag as ShoppingBagIcon,
  Verified as VerifiedIcon,
  MenuBook as MenuBookIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon
} from '@mui/icons-material';

const Sidebar = ({ collapsed, currentPath, onNavigate }) => {
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardIcon />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <PersonIcon />,
      label: 'Customers',
    },
    {
      key: '/vendors',
      icon: <PersonIcon />,
      label: 'Vendors',
    },
    {
      key: '/items',
      icon: <ShoppingCartIcon />,
      label: 'Items',
    },
    {
      key: '/taxes',
      icon: <AttachMoneyIcon />,
      label: 'Taxes',
    },
    {
      key: '/expenses',
      icon: <DescriptionIcon />,
      label: 'Expenses',
    },
    {
      key: '/banking',
      icon: <AccountBalanceIcon />,
      label: 'Banking',
    },
    {
      key: '/notifications',
      icon: <NotificationsIcon />,
      label: 'Notifications',
    },
    {
      key: '/reminders',
      icon: <AccessTimeIcon />,
      label: 'Reminders',
    },
    {
      key: '/invoices',
      icon: <DescriptionIcon />,
      label: 'Invoices',
    },
    {
      key: '/estimates',
      icon: <VerifiedIcon />,
      label: 'Estimates',
    },
    {
      key: '/sales-orders',
      icon: <ShoppingBagIcon />,
      label: 'Sales Orders',
    },
    {
      key: '/purchase-orders',
      icon: <ShoppingCartIcon />,
      label: 'Purchase Orders',
    },
    {
      key: '/bills',
      icon: <DescriptionIcon />,
      label: 'Bills',
    },
    {
      key: '/chart-of-accounts',
      icon: <AccountBalanceWalletIcon />,
      label: 'Chart of Accounts',
    },
    {
      key: '/journal-entries',
      icon: <MenuBookIcon />,
      label: 'Journal Entries',
    },
    {
      key: '/projects',
      icon: <WorkIcon />,
      label: 'Projects',
    },
    {
      key: '/time-tracking',
      icon: <AccessTimeIcon />,
      label: 'Time Tracking',
    },
    {
      key: '/inventory',
      icon: <Inventory2Icon />,
      label: 'Inventory',
    },
    {
      key: '/reports',
      icon: <BarChartIcon />,
      label: 'Reports',
    },
    {
      key: '/settings',
      icon: <SettingsIcon />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = (key) => {
    onNavigate(key);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={!collapsed}
      sx={{
        width: collapsed ? 60 : 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 60 : 250,
          boxSizing: 'border-box',
          backgroundColor: '#001529',
          color: 'white',
          borderRight: 'none'
        },
      }}
    >
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #303030',
          px: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: collapsed ? '16px' : '20px'
          }}
        >
          {collapsed ? 'ZB' : 'ZBooks'}
        </Typography>
      </Box>
      
      <Divider sx={{ backgroundColor: '#303030' }} />
      
      <List sx={{ mt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={currentPath === item.key}
              onClick={() => handleMenuClick(item.key)}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: 2.5,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#1890ff',
                  '&:hover': {
                    backgroundColor: '#40a9ff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 3,
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: 'white',
                      fontSize: '14px'
                    }
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
