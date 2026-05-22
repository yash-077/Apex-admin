import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

const CATEGORIES = ['all', 'Electronics', 'Clothing', 'Books', 'Home', 'Other'];
const PAGE_SIZE = 10;

const ProductTable = ({ products, onEdit, onDelete, loading }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = products.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="table-wrapper">
      {/* Filters */}
      <div className="table-controls">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={handleSearch}
            id="product-search"
          />
        </div>
        <select
          value={category}
          onChange={handleCategory}
          className="category-filter"
          id="category-filter"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Categories' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  <div className="inline-spinner"></div> Loading products...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">No products found.</td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr key={product._id} className="table-row">
                  <td>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="product-thumb"
                     
                    />
                  </td>
                  <td className="product-title-cell" title={product.title}>
                    {product.title}
                  </td>
                  <td>
                    <span className="badge badge-category">{product.category}</span>
                  </td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td>
                    <span className={`badge ${product.stock < 5 ? 'badge-danger' : 'badge-success'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(product)}
                        title="Edit product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(product)}
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-bar">
        <span className="pagination-info">
          Showing {paginated.length} of {filtered.length} results
        </span>
        <div className="pagination-controls">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
