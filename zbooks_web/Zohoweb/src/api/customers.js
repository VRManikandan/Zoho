import axios from "axios";

const API_URL = "http://localhost:5000/api/customers"; // Update if needed

export const getCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};
