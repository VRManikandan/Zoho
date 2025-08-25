import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Mail, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await login(values);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login');
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
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" color="primary" gutterBottom>
            ZBooks
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sign in to your account
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
            name="email"
            value={values.email}
            onChange={handleChange}
            label="Email"
            type="email"
            margin="normal"
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail />
                </InputAdornment>
              ),
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Demo Credentials
          </Typography>
        </Divider>

        <Box textAlign="center" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Email: admin@zbooks.com
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Password: admin123
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
