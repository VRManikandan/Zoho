import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  Typography,
  Divider,
  Box,
  Alert
} from '@mui/material';
import {
  AccountCircle,
  Lock,
  Email,
  Business,
  Phone,
  Language
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    full_name: '',
    email: '',
    password: '',
    organization_name: '',
    organization_address: '',
    organization_phone: '',
    organization_email: '',
    organization_website: ''
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await register(values);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" color="primary" gutterBottom>
            ZBooks
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Create your account
          </Typography>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="full_name"
            value={values.full_name}
            onChange={handleChange}
            label="Full Name"
            margin="normal"
            variant="outlined"
            required
            InputProps={{
              startAdornment: <AccountCircle sx={{ mr: 1 }} />
            }}
          />

          <TextField
            fullWidth
            name="email"
            value={values.email}
            onChange={handleChange}
            label="Email"
            type="email"
            margin="normal"
            variant="outlined"
            required
            InputProps={{
              startAdornment: <Email sx={{ mr: 1 }} />
            }}
          />

          <TextField
            fullWidth
            name="password"
            value={values.password}
            onChange={handleChange}
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            required
            inputProps={{ minLength: 6 }}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1 }} />
            }}
          />

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Organization Details
            </Typography>
          </Divider>

          <TextField
            fullWidth
            name="organization_name"
            value={values.organization_name}
            onChange={handleChange}
            label="Organization Name"
            margin="normal"
            variant="outlined"
            required
            InputProps={{
              startAdornment: <Business sx={{ mr: 1 }} />
            }}
          />

          <TextField
            fullWidth
            name="organization_address"
            value={values.organization_address}
            onChange={handleChange}
            label="Organization Address"
            margin="normal"
            variant="outlined"
            required
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            name="organization_phone"
            value={values.organization_phone}
            onChange={handleChange}
            label="Organization Phone"
            margin="normal"
            variant="outlined"
            required
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1 }} />
            }}
          />

          <TextField
            fullWidth
            name="organization_email"
            value={values.organization_email}
            onChange={handleChange}
            label="Organization Email"
            margin="normal"
            variant="outlined"
            required
            type="email"
            InputProps={{
              startAdornment: <Email sx={{ mr: 1 }} />
            }}
          />

          <TextField
            fullWidth
            name="organization_website"
            value={values.organization_website}
            onChange={handleChange}
            label="Organization Website (Optional)"
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: <Language sx={{ mr: 1 }} />
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <a href="/login" style={{ color: '#1976d2' }}>
              Sign in here
            </a>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Register;
