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
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Inventory,
  Category,
  AttachMoney,
  LocalOffer,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'

  // Mock data for demonstration
  const mockItems = [
    {
      id: 1,
      name: 'Laptop Computer',
      sku: 'LAP-001',
      category: 'Electronics',
      description: 'High-performance laptop for business use',
      price: 1299.99,
      cost: 950.00,
      stock: 25,
      minStock: 5,
      status: 'active',
      type: 'product',
      unit: 'piece',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      name: 'Office Chair',
      sku: 'FUR-001',
      category: 'Furniture',
      description: 'Ergonomic office chair with adjustable features',
      price: 299.99,
      cost: 180.00,
      stock: 15,
      minStock: 3,
      status: 'active',
      type: 'product',
      unit: 'piece',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      name: 'Consulting Service',
      sku: 'SRV-001',
      category: 'Services',
      description: 'Professional consulting services per hour',
      price: 150.00,
      cost: 0.00,
      stock: null,
      minStock: null,
      status: 'active',
      type: 'service',
      unit: 'hour',
      lastUpdated: '2024-01-15'
    },
    {
      id: 4,
      name: 'Software License',
      sku: 'SW-001',
      category: 'Software',
      description: 'Annual software subscription license',
      price: 499.99,
      cost: 200.00,
      stock: 100,
      minStock: 10,
      status: 'active',
      type: 'product',
      unit: 'license',
      lastUpdated: '2024-01-10'
    }
  ];

  useEffect(() => {
    setItems(mockItems);
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

  const handleFilterCategoryChange = (event) => {
    setFilterCategory(event.target.value);
    setPage(0);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleAddItem = () => {
    setDialogMode('add');
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item) => {
    setDialogMode('edit');
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== itemId));
    }
  };

  const handleSaveItem = (itemData) => {
    if (dialogMode === 'add') {
      const newItem = {
        ...itemData,
        id: Date.now(),
        status: 'active',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setItems([...items, newItem]);
    } else {
      setItems(items.map(i => 
        i.id === selectedItem.id ? { ...i, ...itemData } : i
      ));
    }
    setOpenDialog(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStockStatus = (item) => {
    if (item.type === 'service') return 'N/A';
    if (item.stock <= item.minStock) return 'low';
    if (item.stock <= item.minStock * 2) return 'medium';
    return 'good';
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'low': return 'error';
      case 'medium': return 'warning';
      case 'good': return 'success';
      default: return 'default';
    }
  };

  const getStockLabel = (status) => {
    switch (status) {
      case 'low': return 'Low Stock';
      case 'medium': return 'Medium Stock';
      case 'good': return 'Good Stock';
      default: return 'N/A';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Items
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage your inventory items, services, and products
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4">
                {items.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Products
              </Typography>
              <Typography variant="h4">
                {items.filter(i => i.type === 'product').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Services
              </Typography>
              <Typography variant="h4">
                {items.filter(i => i.type === 'service').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="error.main">
                {items.filter(i => i.type === 'product' && i.stock <= i.minStock).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search items..."
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
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={handleFilterCategoryChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Services">Services</MenuItem>
                <MenuItem value="Software">Software</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={handleFilterStatusChange}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              fullWidth
            >
              Add Item
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Items Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: item.type === 'service' ? 'info.main' : 'primary.main' }}>
                        {item.type === 'service' ? <LocalOffer /> : <Inventory />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{item.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          SKU: {item.sku}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.category}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {item.type === 'service' ? (
                      <Typography variant="body2" color="textSecondary">
                        N/A
                      </Typography>
                    ) : (
                      <Box>
                        <Typography variant="body2">
                          {item.stock} {item.unit}
                        </Typography>
                        <Chip
                          label={getStockLabel(getStockStatus(item))}
                          color={getStockColor(getStockStatus(item))}
                          size="small"
                        />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="primary.main">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="textSecondary">
                      ${item.cost.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.type}
                      color={item.type === 'service' ? 'info' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={item.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditItem(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
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
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Item Dialog */}
      <ItemDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        item={selectedItem}
        mode={dialogMode}
        onSave={handleSaveItem}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add item"
        onClick={handleAddItem}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

// Item Dialog Component
const ItemDialog = ({ open, onClose, item, mode, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    type: 'product',
    unit: 'piece',
    status: 'active'
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku,
        category: item.category,
        description: item.description,
        price: item.price.toString(),
        cost: item.cost.toString(),
        stock: item.stock?.toString() || '',
        minStock: item.minStock?.toString() || '',
        type: item.type,
        unit: item.unit,
        status: item.status
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        description: '',
        price: '',
        cost: '',
        stock: '',
        minStock: '',
        type: 'product',
        unit: 'piece',
        status: 'active'
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: formData.type === 'service' ? null : parseInt(formData.stock),
      minStock: formData.type === 'service' ? null : parseInt(formData.minStock)
    };
    onSave(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Item' : 'Edit Item'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Furniture">Furniture</MenuItem>
                  <MenuItem value="Services">Services</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <MenuItem value="product">Product</MenuItem>
                  <MenuItem value="service">Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            {formData.type === 'product' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Stock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? 'Add Item' : 'Update Item'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Items;
