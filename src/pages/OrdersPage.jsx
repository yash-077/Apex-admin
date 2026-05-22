import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/adminaxios';
import { formatPrice, formatDate } from '../utils/helpers';
import { Receipt, Search, RefreshCw } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/purchase');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const userName = o.userId?.name?.toLowerCase() || '';
    const userEmail = o.userId?.email?.toLowerCase() || '';
    const productTitle = o.productId?.title?.toLowerCase() || '';
    return userName.includes(term) || userEmail.includes(term) || productTitle.includes(term);
  });

  if (loading && orders.length === 0) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h2 className="page-heading">Orders & Purchases</h2>
        <div className="header-actions">
          <span className="header-badge">
            <Receipt size={16} /> {orders.length} Total
          </span>
          <button className="btn btn-secondary btn-sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by customer or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="order-search"
            />
          </div>
          <div className="live-indicator">
            <span className="live-dot"></span> Auto-refreshing every 30s
          </div>
        </div>

        <div className="table-scroll">
          <table className="product-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty">No orders found.</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="table-row">
                    <td className="order-id-cell" title={order._id}>
                      #{order._id?.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{order.userId?.name || 'Unknown'}</span>
                        <span className="customer-email">{order.userId?.email || ''}</span>
                      </div>
                    </td>
                    <td>
                      <div className="order-product-info">
                        {order.productId?.imageUrl && (
                          <img
                            src={order.productId.imageUrl}
                            alt=""
                            className="product-thumb-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <span>{order.productId?.title || 'Deleted Product'}</span>
                      </div>
                    </td>
                    <td className="qty-cell">{order.quantity}</td>
                    <td className="price-cell">{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={`badge badge-status badge-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(order.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
