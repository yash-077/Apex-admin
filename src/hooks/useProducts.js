import { useState, useCallback } from 'react';
import api from '../api/adminaxios';
import toast from 'react-hot-toast';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      const res = await api.get('/api/products', { params });
      if (res.data && res.data.success && res.data.data) {
        setProducts(res.data.data);
      } else if (res.data && Array.isArray(res.data)) {
        // Handle case where API returns array directly
        setProducts(res.data);
      } else {
        throw new Error(res.data?.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load products';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData) => {
    try {
      const res = await api.post('/api/products', productData);
      if (res.data && res.data.success && res.data.data) {
        toast.success('Product created successfully!');
        return res.data.data;
      } else if (res.data && res.data._id) {
        // Handle case where API returns product directly
        toast.success('Product created successfully!');
        return res.data;
      } else {
        throw new Error(res.data?.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Add product error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to create product';
      toast.error(msg);
      throw err;
    }
  };

  const editProduct = async (id, productData) => {
    try {
      const res = await api.put(`/api/products/${id}`, productData);
      if (res.data && res.data.success && res.data.data) {
        toast.success('Product updated successfully!');
        return res.data.data;
      } else if (res.data && res.data._id) {
        // Handle case where API returns product directly
        toast.success('Product updated successfully!');
        return res.data;
      } else {
        throw new Error(res.data?.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Edit product error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to update product';
      toast.error(msg);
      throw err;
    }
  };

  const deleteProductItem = async (id) => {
    try {
      const res = await api.delete(`/api/products/${id}`);
      if (res.data && res.data.success) {
        toast.success('Product deleted successfully!');
        return true;
      } else {
        throw new Error(res.data?.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to delete product';
      toast.error(msg);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct: deleteProductItem,
  };
};
export default useProducts;
