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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { useAuth } from '../context/AuthContext';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const { user } = useAuth();

  // Form state
  const [formValues, setFormValues] = useState({
    invoice_number: '',
    customer: '',
    invoice_date: null,
    due_date: null,
    amount: '',
  });

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Mock data
  useEffect(() => {
    setInvoices([
      {
        id: 1,
        invoice_number: 'INV-001',
        customer: 'ABC Corporation',
        invoice_date: '2024-01-15',
        due_date: '2024-02-15',
        amount: 1500.0,
        status: 'paid',
        items: [
          { name: 'Premium Widget', quantity: 5, rate: 200.0, amount: 1000.0 },
          { name: 'Consulting Service', quantity: 10, rate: 50.0, amount: 500.0 },
        ],
      },
      {
        id: 2,
        invoice_number: 'INV-002',
        customer: 'XYZ Company',
        invoice_date: '2024-01-20',
        due_date: '2024-02-20',
        amount: 2500.0,
        status: 'pending',
        items: [{ name: 'Enterprise Solution', quantity: 1, rate: 2500.0, amount: 2500.0 }],
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
    };
    return colors[status] || 'default';
  };

  const openModal = (invoice = null) => {
    setEditingInvoice(invoice);
    if (invoice) {
      setFormValues({
        invoice_number: invoice.invoice_number,
        customer: invoice.customer,
        invoice_date: new Date(invoice.invoice_date),
        due_date: new Date(invoice.due_date),
        amount: invoice.amount,
      });
    } else {
      setFormValues({
        invoice_number: '',
        customer: '',
        invoice_date: null,
        due_date: null,
        amount: '',
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingInvoice) {
      const updatedInvoices = invoices.map((inv) =>
        inv.id === editingInvoice.id ? { ...inv, ...formValues } : inv
      );
      setInvoices(updatedInvoices);
      alert('Invoice updated successfully!');
    } else {
      const newInvoice = {
        id: Date.now(),
        ...formValues,
        status: 'draft',
      };
      setInvoices([...invoices, newInvoice]);
      alert('Invoice created successfully!');
    }
    setModalOpen(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.includes(search) ||
      inv.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const invoiceDate = new Date(inv.invoice_date);
    const matchesStart = startDate ? invoiceDate >= startDate : true;
    const matchesEnd = endDate ? invoiceDate <= endDate : true;
    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  return (
    <Box p={3}>
      <Card>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} mb={2}>
          <Typography variant="h5">Invoices</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openModal()}>
            Create Invoice
          </Button>
        </Box>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} p={2} mb={2}>
          <TextField
            label="Search invoices..."
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
                <TableCell>Invoice #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <Typography fontWeight="bold">{inv.invoice_number}</Typography>
                  </TableCell>
                  <TableCell>{inv.customer}</TableCell>
                  <TableCell>{inv.invoice_date}</TableCell>
                  <TableCell>{inv.due_date}</TableCell>
                  <TableCell>${inv.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={inv.status.toUpperCase()} color={getStatusColor(inv.status)} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => openModal(inv)}>
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

        {/* Modal Form */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Invoice Number"
                fullWidth
                value={formValues.invoice_number}
                onChange={(e) => setFormValues({ ...formValues, invoice_number: e.target.value })}
              />
              <TextField
                label="Customer"
                fullWidth
                value={formValues.customer}
                onChange={(e) => setFormValues({ ...formValues, customer: e.target.value })}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Invoice Date"
                  value={formValues.invoice_date}
                  onChange={(newValue) => setFormValues({ ...formValues, invoice_date: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <DatePicker
                  label="Due Date"
                  value={formValues.due_date}
                  onChange={(newValue) => setFormValues({ ...formValues, due_date: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={formValues.amount}
                onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              {editingInvoice ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default Invoices;
