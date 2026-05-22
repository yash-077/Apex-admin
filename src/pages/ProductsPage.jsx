import React, { useEffect, useState, useCallback } from 'react';
import useProducts from '../hooks/useProducts';
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const ProductsPage = () => {
  const { products, loading, fetchProducts, addProduct, editProduct, deleteProduct } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setConfirmOpen(true);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingProduct) {
        await editProduct(editingProduct._id, data);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(data);
        toast.success('Product created successfully!');
      }
      setModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      // Error toast is handled inside the hook
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deletingProduct._id);
      toast.success('Product deleted successfully!');
      setConfirmOpen(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      // Error toast is handled inside the hook
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h2 className="page-heading">Products Management</h2>
        <button className="btn btn-primary btn-sm" onClick={handleAdd} id="add-product-btn">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="card">
        <ProductTable
          products={products}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSubmit={handleModalSubmit}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeletingProduct(null);
        }}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProductsPage;
