import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setPayments([
      {
        id: 1,
        payment_number: 'PAY-001',
        customer: 'ABC Corporation',
        invoice: 'INV-001',
        payment_date: '2024-01-20',
        amount: 1500.0,
        payment_mode: 'bank_transfer',
        reference_no: 'TXN123456',
        status: 'completed',
      },
      {
        id: 2,
        payment_number: 'PAY-002',
        customer: 'XYZ Company',
        invoice: 'INV-002',
        payment_date: '2024-01-25',
        amount: 2500.0,
        payment_mode: 'credit_card',
        reference_no: 'CC789012',
        status: 'pending',
      },
    ]);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      completed: 'success',
      failed: 'error',
      cancelled: 'default',
    };
    return colors[status] || 'default';
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.payment_number.includes(search) ||
      p.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const paymentDate = new Date(p.payment_date);
    const matchesStartDate = startDate ? paymentDate >= startDate : true;
    const matchesEndDate = endDate ? paymentDate <= endDate : true;
    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  return (
    <Box p={3}>
      <Card>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} p={2}>
          <Typography variant="h5">Payments</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Record Payment
          </Button>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} p={2} mb={2}>
          <TextField
            label="Search payments..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Typography fontWeight="bold">{payment.payment_number}</Typography>
                  </TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.invoice}</TableCell>
                  <TableCell>{payment.payment_date}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.payment_mode.replace('_', ' ').toUpperCase()}</TableCell>
                  <TableCell>
                    <Chip label={payment.status.toUpperCase()} color={getStatusColor(payment.status)} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <PrintIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Payments;
