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
  FileCopy as FileProtectIcon,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Estimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setEstimates([
      {
        id: 1,
        estimate_number: 'EST-001',
        customer: 'ABC Corporation',
        estimate_date: '2024-01-15',
        expiry_date: '2024-02-15',
        amount: 1500.0,
        status: 'sent',
        items: [
          { name: 'Premium Widget', quantity: 5, rate: 200.0, amount: 1000.0 },
          { name: 'Consulting Service', quantity: 10, rate: 50.0, amount: 500.0 },
        ],
      },
      {
        id: 2,
        estimate_number: 'EST-002',
        customer: 'XYZ Company',
        estimate_date: '2024-01-20',
        expiry_date: '2024-02-20',
        amount: 2500.0,
        status: 'draft',
        items: [{ name: 'Enterprise Solution', quantity: 1, rate: 2500.0, amount: 2500.0 }],
      },
    ]);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      sent: 'info',
      accepted: 'success',
      rejected: 'error',
      expired: 'warning',
    };
    return colors[status] || 'default';
  };

  const filteredEstimates = estimates.filter((est) => {
    const matchesSearch =
      est.estimate_number.includes(search) ||
      est.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || est.status === statusFilter;
    const estimateDate = new Date(est.estimate_date);
    const matchesStart = startDate ? estimateDate >= startDate : true;
    const matchesEnd = endDate ? estimateDate <= endDate : true;
    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  return (
    <Box p={3}>
      <Card>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} mb={2}>
          <Typography variant="h5">Estimates</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Estimate
          </Button>
        </Box>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} p={2} mb={2}>
          <TextField
            label="Search estimates..."
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
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
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
                <TableCell>Estimate #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEstimates.map((est) => (
                <TableRow key={est.id}>
                  <TableCell>
                    <Typography fontWeight="bold">{est.estimate_number}</Typography>
                  </TableCell>
                  <TableCell>{est.customer}</TableCell>
                  <TableCell>{est.estimate_date}</TableCell>
                  <TableCell>{est.expiry_date}</TableCell>
                  <TableCell>${est.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={est.status.toUpperCase()} color={getStatusColor(est.status)} />
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
                      <IconButton size="small">
                        <FileProtectIcon />
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

export default Estimates;
