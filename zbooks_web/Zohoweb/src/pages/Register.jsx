import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  Typography,
  Divider,
  Box,
  Alert,
  Grid,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  Select,
  MenuItem
} from '@mui/material';
import {
  AccountCircle,
  Lock,
  Email,
  Business,
  Phone,
  Language,
  Public,
  Place
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const countries = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
];

const indiaStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Puducherry'
];

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    company_name: '',
    email: '',
    password: '',
    phone_cc: '+91',
    phone: '',
    country: 'India',
    state: 'Tamil Nadu',
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await register({
        full_name: values.company_name, // Use company name as full name for now
        company_name: values.company_name,
        email: values.email,
        password: values.password,
        phone_cc: values.phone_cc,
        phone: values.phone,
        country: values.country,
        state: values.state,
      });
      if (result?.success) navigate('/dashboard');
      else setErrorMessage(result?.error || 'Registration failed');
    } catch (err) {
      setErrorMessage('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
      <Card sx={{ maxWidth: 520, width: '100%', p: 4, borderRadius: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
             <span style={{ color: '#111' }}>Kloudoz</span> Book
          </Typography>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Company name */}
          <TextField
            fullWidth
            name="company_name"
            value={values.company_name}
            onChange={handleChange}
            label="Company Name"
            margin="normal"
            required
            InputProps={{ startAdornment: (
              <InputAdornment position="start"><Business fontSize="small"/></InputAdornment>
            )}}
          />

          {/* Email */}
          <TextField
            fullWidth
            name="email"
            value={values.email}
            onChange={handleChange}
            label="Email address"
            type="email"
            margin="normal"
            required
            InputProps={{ startAdornment: (
              <InputAdornment position="start"><Email fontSize="small"/></InputAdornment>
            )}}
          />

          {/* Mobile */}
          <Grid container spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Grid item xs={4} sm={3}>
              <Select
                fullWidth
                size="medium"
                name="phone_cc"
                value={values.phone_cc}
                onChange={handleChange}
                startAdornment={<InputAdornment position="start"><Phone fontSize="small"/></InputAdornment>}
              >
                {countries.map((c) => (
                  <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={8} sm={9}>
              <TextField
                fullWidth
                name="phone"
                value={values.phone}
                onChange={handleChange}
                label="Mobile Number"
                inputMode="tel"
                required
              />
            </Grid>
          </Grid>

          {/* Password */}
          <TextField
            fullWidth
            name="password"
            value={values.password}
            onChange={handleChange}
            label="Password"
            type="password"
            margin="normal"
            required
            inputProps={{ minLength: 6 }}
            InputProps={{ startAdornment: (
              <InputAdornment position="start"><Lock fontSize="small"/></InputAdornment>
            )}}
          />

          {/* Country & State */}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="country"
                value={values.country}
                onChange={handleChange}
                label="Country"
                InputProps={{ startAdornment: (
                  <InputAdornment position="start"><Public fontSize="small"/></InputAdornment>
                )}}
              >
                {countries.map((c) => (
                  <MenuItem key={c.name} value={c.name}>{c.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="state"
                value={values.state}
                onChange={handleChange}
                label="State"
                InputProps={{ startAdornment: (
                  <InputAdornment position="start"><Place fontSize="small"/></InputAdornment>
                )}}
              >
                {indiaStates.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          {/* Data center note */}
          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
            Your data will be in INDIA data center.
          </Typography>

          {/* Terms */}
          <FormControlLabel
            sx={{ mt: 1 }}
            control={<Checkbox required/>}
            label={
              <Typography variant="body2" color="text.secondary">
                I agree to the <Link href="#" underline="hover">Terms of Service</Link> and <Link href="#" underline="hover">Privacy Policy</Link>.
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2.5, py: 1.4, backgroundColor: '#f5a623', '&:hover': { backgroundColor: '#f29b0b' } }}
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create my account'}
          </Button>

          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
            *No credit card required
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Social sign up */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button variant="outlined" size="small">G</Button>
            <Button variant="outlined" size="small">Zo</Button>
            <Button variant="outlined" size="small">in</Button>
            <Button variant="outlined" size="small"></Button>
            <Button variant="outlined" size="small">f</Button>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <Link href="/login" underline="hover">Log in</Link>
            </Typography>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
