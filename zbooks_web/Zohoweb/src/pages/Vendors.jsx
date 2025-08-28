import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Business,
  Email,
  Phone,
  AccountBalance,
  LocationOn,
  Receipt
} from '@mui/icons-material';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'

  // Mock data for demonstration
  const mockVendors = [
    {
      id: 1,
      name: 'ABC Supplies Co.',
      email: 'contact@abcsupplies.com',
      phone: '+1-555-0101',
      contactPerson: 'Mike Johnson',
      status: 'active',
      balance: 2500.00,
      lastPurchase: '2024-01-20',
      address: '100 Industrial Ave, Business District, State 12345',
      paymentTerms: 'Net 30',
      taxId: '12-3456789'
    },
    {
      id: 2,
      name: 'Tech Parts Inc.',
      email: 'sales@techparts.com',
      phone: '+1-555-0102',
      contactPerson: 'Sarah Wilson',
      status: 'active',
      balance: 0.00,
      lastPurchase: '2024-01-18',
      address: '200 Technology Blvd, Tech Park, State 12345',
      paymentTerms: 'Net 15',
      taxId: '98-7654321'
    },
    {
      id: 3,
      name: 'Office Solutions Ltd.',
      email: 'info@officesolutions.com',
      phone: '+1-555-0103',
      contactPerson: 'David Brown',
      status: 'inactive',
      balance: 750.00,
      lastPurchase: '2023-12-15',
      address: '300 Office Plaza, Downtown, State 12345',
      paymentTerms: 'Net 30',
      taxId: '45-6789012'
    }
  ];

  useEffect(() => {
    setVendors(mockVendors);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleAddVendor = () => {
    setDialogMode('add');
    setSelectedVendor(null);
    setOpenDialog(true);
  };

  const handleEditVendor = (vendor) => {
    setDialogMode('edit');
    setSelectedVendor(vendor);
    setOpenDialog(true);
  };

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== vendorId));
    }
  };

  const handleSaveVendor = (vendorData) => {
    if (dialogMode === 'add') {
      const newVendor = {
        ...vendorData,
        id: Date.now(),
        status: 'active',
        balance: 0.00,
        lastPurchase: new Date().toISOString().split('T')[0]
      };
      setVendors([...vendors, newVendor]);
    } else {
      setVendors(vendors.map(v => 
        v.id === selectedVendor.id ? { ...v, ...vendorData } : v
      ));
    }
    setOpenDialog(false);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedVendors = filteredVendors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Vendors
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage your vendor relationships and track purchase history
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Vendors
              </Typography>
              <Typography variant="h4">
                {vendors.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Vendors
              </Typography>
              <Typography variant="h4">
                {vendors.filter(v => v.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Payable
              </Typography>
              <Typography variant="h4" color="error.main">
                ${vendors.reduce((sum, v) => sum + v.balance, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Purchases This Month
              </Typography>
              <Typography variant="h4">
                {vendors.filter(v => {
                  const lastMonth = new Date();
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  return new Date(v.lastPurchase) >= lastMonth;
                }).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddVendor}
              fullWidth
            >
              Add Vendor
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Vendors Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell>Payment Terms</TableCell>
                <TableCell>Last Purchase</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVendors.map((vendor) => (
                <TableRow key={vendor.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{vendor.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {vendor.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.contactPerson}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Tax ID: {vendor.taxId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Email sx={{ fontSize: 16, mr: 1 }} />
                        {vendor.email}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ fontSize: 16, mr: 1 }} />
                        {vendor.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.status}
                      color={vendor.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={vendor.balance > 0 ? 'error.main' : 'textSecondary'}
                    >
                      ${vendor.balance.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.paymentTerms}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(vendor.lastPurchase).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditVendor(vendor)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteVendor(vendor.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVendors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Vendor Dialog */}
      <VendorDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        vendor={selectedVendor}
        mode={dialogMode}
        onSave={handleSaveVendor}
      />

      {/* Floating Action Button */}
      <Fab
        color="secondary"
        aria-label="add vendor"
        onClick={handleAddVendor}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

// Vendor Dialog Component
const VendorDialog = ({ open, onClose, vendor, mode, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contactPerson: '',
    address: '',
    paymentTerms: 'Net 30',
    taxId: ''
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        contactPerson: vendor.contactPerson,
        address: vendor.address,
        paymentTerms: vendor.paymentTerms,
        taxId: vendor.taxId
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        contactPerson: '',
        address: '',
        paymentTerms: 'Net 30',
        taxId: ''
      });
    }
  }, [vendor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Vendor' : 'Edit Vendor'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax ID"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Terms</InputLabel>
                <Select
                  value={formData.paymentTerms}
                  label="Payment Terms"
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                >
                  <MenuItem value="Net 15">Net 15</MenuItem>
                  <MenuItem value="Net 30">Net 30</MenuItem>
                  <MenuItem value="Net 45">Net 45</MenuItem>
                  <MenuItem value="Net 60">Net 60</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? 'Add Vendor' : 'Update Vendor'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Vendors;
