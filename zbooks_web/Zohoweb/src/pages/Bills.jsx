import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setBills([
      {
        id: 1,
        bill_number: 'BILL-001',
        vendor: 'XYZ Supplies',
        bill_date: '2024-01-15',
        due_date: '2024-02-15',
        amount: 2500.0,
        status: 'pending',
        items: [{ name: 'Office Supplies', quantity: 100, rate: 25.0, amount: 2500.0 }],
      },
      {
        id: 2,
        bill_number: 'BILL-002',
        vendor: 'ABC Services',
        bill_date: '2024-01-20',
        due_date: '2024-02-20',
        amount: 1500.0,
        status: 'paid',
        items: [{ name: 'Consulting Service', quantity: 30, rate: 50.0, amount: 1500.0 }],
      },
    ]);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      sent: 'info',
      paid: 'success',
      overdue: 'error',
      partial: 'warning',
      pending: 'warning',
    };
    return colors[status] || 'default';
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.bill_number.includes(search) || bill.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    const billDate = new Date(bill.bill_date);
    const matchesStart = startDate ? billDate >= startDate : true;
    const matchesEnd = endDate ? billDate <= endDate : true;
    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  return (
    <Box p={3}>
      <Card>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} mb={2}>
          <Typography variant="h5">Bills</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Bill
          </Button>
        </Box>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} p={2} mb={2}>
          <TextField
            label="Search bills..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
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

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bill #</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Bill Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    <Typography fontWeight="bold">{bill.bill_number}</Typography>
                  </TableCell>
                  <TableCell>{bill.vendor}</TableCell>
                  <TableCell>{bill.bill_date}</TableCell>
                  <TableCell>{bill.due_date}</TableCell>
                  <TableCell>${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={bill.status.toUpperCase()} color={getStatusColor(bill.status)} />
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
                      <IconButton size="small">
                        <MailIcon />
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

export default Bills;
