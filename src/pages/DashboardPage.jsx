import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/adminaxios';
import StatCard from '../components/StatCard';
import { formatPrice, formatDate } from '../utils/helpers';
import {
  ShoppingBag,
  Layers,
  AlertTriangle,
  Receipt,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/purchase'),
        ]);
        if (prodRes.data?.success) setProducts(prodRes.data.data);
        if (orderRes.data?.success) setOrders(orderRes.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const recentProducts = products.slice(0, 5);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2 className="page-heading">Dashboard Overview</h2>
        <Link to="/dashboard/products" className="btn btn-primary btn-sm">
          <ShoppingBag size={16} /> Manage Products
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={ShoppingBag}
          colorClass="stat-blue"
          description="Products in catalog"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={Receipt}
          colorClass="stat-green"
          description="Purchases placed"
        />
       
      </div>

    </div>
  );
};

export default DashboardPage;
