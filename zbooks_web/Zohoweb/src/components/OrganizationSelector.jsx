import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Avatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Business, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const OrganizationSelector = ({ compact = false }) => {
  const { user, currentOrganization, switchOrganization } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrganizationChange = async (event) => {
    const organizationId = event.target.value;
    if (organizationId === currentOrganization?.id) return;

    setLoading(true);
    setError('');

    try {
      const result = await switchOrganization(organizationId);
      if (!result.success) {
        setError(result.error || 'Failed to switch organization');
      }
    } catch (err) {
      setError('An error occurred while switching organization');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.organizations || user.organizations.length <= 1) {
    return null; // Don't show selector if user has only one organization
  }

  if (compact) {
    return (
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth size="small">
          <Select
            value={currentOrganization?.id || ''}
            onChange={handleOrganizationChange}
            disabled={loading}
            displayEmpty
            renderValue={(selected) => {
              const org = user.organizations.find(o => o.id === selected);
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                    <Business fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" noWrap>
                    {org?.name || 'Select Organization'}
                  </Typography>
                  {loading && <CircularProgress size={16} />}
                </Box>
              );
            }}
          >
            {user.organizations.map((org) => (
              <MenuItem key={org.id} value={org.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <Business />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {org.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={org.role} 
                        size="small" 
                        color={org.role === 'owner' ? 'primary' : 'default'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      {org.is_default && (
                        <CheckCircle color="success" sx={{ fontSize: 16 }} />
                      )}
                    </Box>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {error && (
          <Alert severity="error" sx={{ mt: 1, fontSize: '0.8rem' }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Select Organization
      </Typography>
      
      <FormControl fullWidth>
        <InputLabel>Organization</InputLabel>
        <Select
          value={currentOrganization?.id || ''}
          onChange={handleOrganizationChange}
          disabled={loading}
          label="Organization"
        >
          {user.organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Business />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {org.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip 
                      label={org.role} 
                      size="small" 
                      color={org.role === 'owner' ? 'primary' : 'default'}
                    />
                    {org.is_default && (
                      <Chip 
                        label="Current" 
                        size="small" 
                        color="success"
                        icon={<CheckCircle />}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default OrganizationSelector;
