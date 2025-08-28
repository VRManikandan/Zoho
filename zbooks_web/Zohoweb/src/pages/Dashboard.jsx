import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
  WarningAmber as WarningAmberIcon,
  AccountBalance as AccountBalanceIcon,
  AccessTime as AccessTimeIcon,
  PersonAdd as PersonAddIcon,
  Receipt as ReceiptIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  Description as FileTextIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import api from '../api/auth';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const [stats, setStats] = useState({});
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard statistics
      const statsResponse = await api.get('/dashboard/stats/');
      setStats(statsResponse.data);

      // Fetch recent invoices
      const invoicesResponse = await api.get('/sales/invoices/', { params: { limit: 5 } });
      setRecentInvoices(invoicesResponse.data.results || invoicesResponse.data || []);

      // Fetch recent payments
      const paymentsResponse = await api.get('/sales/payments/', { params: { limit: 5 } });
      setRecentPayments(paymentsResponse.data.results || paymentsResponse.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const invoiceColumns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => `₹${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
  ];

  const paymentColumns = [
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: 'Mode',
      dataIndex: 'payment_mode',
      key: 'payment_mode',
      render: (mode) => mode.replace('_', ' ').toUpperCase(),
    },
  ];

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="400px"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchDashboardData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.full_name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with {organization?.name || 'your organization'}
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AttachMoneyIcon sx={{ color: '#3f8600', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#3f8600', mb: 1 }}>
                ₹{(stats.totalRevenue || 0).toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon sx={{ fontSize: 16, color: '#3f8600', mr: 0.5 }} />
                <Typography variant="body2" color="#3f8600">
                  +12.5% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DescriptionIcon sx={{ color: '#cf1322', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Pending Invoices
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#cf1322', mb: 1 }}>
                {stats.pendingInvoices || 0}
              </Typography>
              <Box display="flex" alignItems="center">
                <WarningAmberIcon sx={{ fontSize: 16, color: '#cf1322', mr: 0.5 }} />
                <Typography variant="body2" color="#cf1322">
                  ₹{(stats.pendingAmount || 0).toLocaleString()} pending
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ color: '#1890ff', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Customers
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#1890ff', mb: 1 }}>
                {stats.totalCustomers || 0}
              </Typography>
              <Box display="flex" alignItems="center">
                <PersonAddIcon sx={{ fontSize: 16, color: '#1890ff', mr: 0.5 }} />
                <Typography variant="body2" color="#1890ff">
                  +5 new this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ShoppingCartIcon sx={{ color: '#722ed1', mr: 1 }} />
                <Typography variant="h6" component="div">
                  This Month Sales
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#722ed1', mb: 1 }}>
                ₹{(stats.monthlySales || 0).toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon sx={{ fontSize: 16, color: '#722ed1', mr: 0.5 }} />
                <Typography variant="body2" color="#722ed1">
                  +8.3% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Progress */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                height="200px"
                textAlign="center"
              >
                <TrendingUpIcon sx={{ fontSize: 48, color: '#52c41a', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Revenue trend chart
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly revenue visualization will be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '300px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collection Rate
              </Typography>
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                height="200px"
                textAlign="center"
              >
                <Box position="relative" display="inline-flex" mb={2}>
                  <CircularProgress
                    variant="determinate"
                    value={stats.collectionRate || 75}
                    size={120}
                    thickness={4}
                    sx={{ color: '#52c41a' }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="h6" component="div" color="text.secondary">
                      {`${Math.round(stats.collectionRate || 75)}%`}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" gutterBottom>
                  Current collection rate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target: 90%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Invoices
                </Typography>
                <Button 
                  variant="text" 
                  onClick={() => window.location.href = '/invoices'}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Invoice #</strong></TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentInvoices.length > 0 ? recentInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell><strong>{invoice.invoice_number}</strong></TableCell>
                        <TableCell>{invoice.customer?.name}</TableCell>
                        <TableCell>₹{parseFloat(invoice.total).toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            size="small"
                            color={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No recent invoices
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Payments
                </Typography>
                <Button 
                  variant="text" 
                  onClick={() => window.location.href = '/payments'}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Mode</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPayments.length > 0 ? recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.customer?.name}</TableCell>
                        <TableCell>₹{parseFloat(payment.amount).toLocaleString()}</TableCell>
                        <TableCell>{payment.payment_mode?.replace('_', ' ').toUpperCase()}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No recent payments
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button 
                  variant="contained" 
                  startIcon={<FileTextIcon />} 
                  size="large"
                >
                  Create Invoice
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ShoppingCartOutlinedIcon />} 
                  size="large"
                >
                  New Estimate
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<PersonIcon />} 
                  size="large"
                >
                  Add Customer
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AccountBalanceIcon />} 
                  size="large"
                >
                  Record Payment
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AccessTimeIcon />} 
                  size="large"
                >
                  Track Time
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: '50%', 
                        backgroundColor: '#f6ffed', 
                        color: '#52c41a' 
                      }}
                    >
                      <AccountBalanceIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Bank Sync
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last updated: 2 hours ago
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: '50%', 
                        backgroundColor: '#fff7e6', 
                        color: '#fa8c16' 
                      }}
                    >
                      <AccessTimeIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Backup
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last backup: 1 day ago
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: '50%', 
                        backgroundColor: '#f6ffed', 
                        color: '#52c41a' 
                      }}
                    >
                      <DescriptionIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Reports
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        All reports up to date
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: '50%', 
                        backgroundColor: '#f6ffed', 
                        color: '#52c41a' 
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Users
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        3 active users online
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
