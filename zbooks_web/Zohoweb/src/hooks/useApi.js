import { useState, useCallback } from 'react';
import api from '../api/auth';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError
  };
};

export const useGet = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoint, { params });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    refresh
  };
};

export const usePost = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    loading,
    error,
    postData
  };
};

export const usePut = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    loading,
    error,
    putData
  };
};

export const useDelete = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`${endpoint}${id}/`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    loading,
    error,
    deleteData
  };
};
