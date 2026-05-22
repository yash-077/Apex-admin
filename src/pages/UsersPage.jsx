import React, { useEffect, useState } from 'react';
import api from '../api/adminaxios';
import { formatDate } from '../utils/helpers';
import { Users, Search, ShieldCheck, User } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/users');
        if (res.data?.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h2 className="page-heading">Registered Users</h2>
        <span className="header-badge">
          <Users size={16} /> {users.length} Total
        </span>
      </div>

      <div className="card">
        <div className="table-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="user-search"
            />
          </div>
        </div>

        <div className="table-scroll">
          <table className="product-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty">No users found.</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user._id} className="table-row">
                    <td>
                      <div className="user-avatar-table">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </td>
                    <td className="product-title-cell">{user.name}</td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {user.role === 'admin' ? (
                          <><ShieldCheck size={12} /> Admin</>
                        ) : (
                          <><User size={12} /> User</>
                        )}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(user.createdAt)}</td>
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

export default UsersPage;
