import React, { useState } from 'react';
import { Box, Card, Typography, Grid, TextField, Button, MenuItem, Alert } from '@mui/material';
import { useOrganization } from '../context/OrganizationContext';

const OrgSetup = () => {
  const { createOrg } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    fiscal_year_start: '2025-04-01'
  });

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createOrg(values);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb', p: 2 }}>
      <Card sx={{ maxWidth: 900, width: '100%', p: 4 }}>
        <Typography variant="h5" gutterBottom>Set up your organization profile</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField name="name" label="Organization Name" fullWidth required value={values.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="email" label="Email" fullWidth required value={values.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="phone" label="Phone" fullWidth required value={values.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="address" label="Organization Address" fullWidth required multiline rows={3} value={values.address} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="website" label="Website (Optional)" fullWidth value={values.website} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="currency" label="Currency" select fullWidth value={values.currency} onChange={handleChange}>
                <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="timezone" label="Time Zone" fullWidth value={values.timezone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="fiscal_year_start" label="Fiscal Year Start" fullWidth type="date" InputLabelProps={{ shrink: true }} value={values.fiscal_year_start} onChange={handleChange} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>Save Organization</Button>
        </form>
      </Card>
    </Box>
  );
};

export default OrgSetup;


