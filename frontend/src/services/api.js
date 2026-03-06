import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-system-3cwf.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
};

export const productService = {
  list: (params) => api.get('/products', { params }),
  detail: (id) => api.get(`/products/${id}`),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove: (id) => api.delete(`/products/${id}`),
};

export const cartService = {
  get: () => api.get('/cart'),
  add: (payload) => api.post('/cart/add', payload),
  remove: (productId) => api.delete('/cart/remove', { data: { productId } }),
};

export const orderService = {
  create: (payload) => api.post('/orders', payload),
  list: () => api.get('/orders'),
  detail: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, payload) => api.put(`/orders/${id}/status`, payload),
};

export default api;
