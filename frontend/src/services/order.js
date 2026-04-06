import API from './api';

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderToPaid = (id, data) => API.put(`/orders/${id}/pay`, data);
