import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrganizationInfo } from '../api/organization';

const OrganizationContext = createContext();

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const orgData = await getOrganizationInfo();
        setOrganization(orgData);
      } catch (error) {
        console.error('Failed to load organization:', error);
        // Set default organization for demo
        setOrganization({
          id: 1,
          name: 'ZBooks Company',
          address: '123 Business Street, City, State 12345',
          phone: '+1-555-0123',
          email: 'info@zbooks.com',
          website: 'https://zbooks.com',
          gst_number: 'GST123456789',
          pan_number: 'ABCDE1234F',
          currency: 'USD',
          fiscal_year_start: '2024-01-01',
          timezone: 'America/New_York'
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrganization();
  }, []);

  const updateOrganization = (newData) => {
    setOrganization(prev => ({ ...prev, ...newData }));
  };

  const value = {
    organization,
    loading,
    updateOrganization
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
