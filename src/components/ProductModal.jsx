import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product, onSubmit }) => {
  const isEditMode = !!product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      price: '',
      category: '',
      stock: '',
    },
  });

  // Reset/populate form values when modal visibility or input product changes
  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          title: product.title || '',
          description: product.description || '',
          imageUrl: product.imageUrl || '',
          price: product.price || '',
          category: product.category || '',
          stock: product.stock !== undefined ? product.stock : '',
        });
      } else {
        reset({
          title: '',
          description: '',
          imageUrl: '',
          price: '',
          category: '',
          stock: '',
        });
      }
    }
  }, [isOpen, product, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10),
    };
    await onSubmit(formattedData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3 className="modal-title">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
              })}
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title.message}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                {...register('category', { required: 'Category is required' })}
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <span className="error-message">{errors.category.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL *</label>
              <input
                type="url"
                id="imageUrl"
                placeholder="e.g. https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                {...register('imageUrl', {
                  required: 'Image URL is required',
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                    message: 'Please enter a valid URL',
                  },
                })}
                className={errors.imageUrl ? 'input-error' : ''}
              />
              {errors.imageUrl && <span className="error-message">{errors.imageUrl.message}</span>}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                id="price"
                placeholder="0.00"
                {...register('price', {
                  required: 'Price is required',
                  validate: (value) => parseFloat(value) > 0 || 'Price must be greater than 0',
                })}
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                placeholder="0"
                {...register('stock', {
                  required: 'Stock is required',
                  validate: (value) => parseInt(value, 10) >= 0 || 'Stock must be 0 or greater',
                })}
                className={errors.stock ? 'input-error' : ''}
              />
              {errors.stock && <span className="error-message">{errors.stock.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              rows="4"
              placeholder="Provide a detailed product description..."
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
              })}
              className={errors.description ? 'input-error' : ''}
            ></textarea>
            {errors.description && (
              <span className="error-message">{errors.description.message}</span>
            )}
          </div>

          <footer className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Product'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
