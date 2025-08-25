import api from './auth';

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
