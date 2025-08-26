import api from './auth';

export const listMyOrganizations = async () => {
  const res = await api.get('/organizations/my/');
  return res.data;
};

export const createOrganization = async (data) => {
  const res = await api.post('/organizations/', data);
  return res.data;
};

export const switchOrganization = async (orgId) => {
  const res = await api.post(`/organizations/${orgId}/switch/`);
  return res.data;
};

export const getOrganizationInfo = async () => {
  try {
    const response = await api.get('/organization/info/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch organization info');
  }
};

export const updateOrganization = async (data) => {
  try {
    const response = await api.put('/organization/update/', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update organization');
  }
};

export const getOrganizationSettings = async () => {
  try {
    const response = await api.get('/organization/settings/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch organization settings');
  }
};
