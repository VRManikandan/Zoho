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
import { Mail, Lock, PhoneIphone, Verified } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [otpMode, setOtpMode] = useState(false);
  const [otpDestination, setOtpDestination] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (otpMode) {
        // OTP verify
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/otp/verify/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination: otpDestination, code: otpCode })
        });
        if (!res.ok) throw new Error('OTP verification failed');
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        navigate('/dashboard');
        return;
      }
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

  const requestOtp = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/otp/request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: otpDestination })
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      setOtpMode(true);
    } catch (e) {
      setErrorMessage(e.message);
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

        {!otpMode && (
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
        )}

        {/* OTP Login */}
        {otpMode ? (
          <>
            <TextField
              fullWidth
              name="otp"
              value={otpCode}
              onChange={(e)=>setOtpCode(e.target.value)}
              label="Enter OTP"
              margin="normal"
              variant="outlined"
              required
              InputProps={{ startAdornment: (<InputAdornment position="start"><Verified /></InputAdornment>) }}
            />
            <Button onClick={handleSubmit} variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
              Verify & Sign In
            </Button>
          </>
        ) : (
          <>
            <Divider sx={{ my: 2 }}>OR</Divider>
            <TextField
              fullWidth
              name="destination"
              value={otpDestination}
              onChange={(e)=>setOtpDestination(e.target.value)}
              label="Email or Mobile"
              margin="normal"
              variant="outlined"
              InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIphone /></InputAdornment>) }}
            />
            <Button onClick={requestOtp} variant="outlined" fullWidth disabled={loading}>
              Send OTP
            </Button>
          </>
        )}

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
