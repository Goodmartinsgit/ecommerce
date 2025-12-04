import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { baseUrl } from '../config/config';
import { getToken } from '../utils/auth';

const ProductForm = ({ closeModal, onSuccess, product = null }) => {
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    sizes: "",
    defaultSize: "",
    colors: "",
    defaultColor: "",
    bestSeller: false,
    subcategory: "",
    rating: "0",
    discount: "0",
    newArrival: false,
    tags: "",
    stock: "0",
    categoryId: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories and populate form if editing
  useEffect(() => {
    fetchCategories();

    if (isEdit && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        currency: product.currency || "USD",
        sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
        defaultSize: product.defaultSize || "",
        colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
        defaultColor: product.defaultColor || "",
        bestSeller: product.bestSeller || false,
        subcategory: product.subcategory || "",
        rating: product.rating?.toString() || "0",
        discount: product.discount?.toString() || "0",
        newArrival: product.newArrival || false,
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        stock: product.stock?.toString() || "0",
        categoryId: product.categoryId?.toString() || "",
        image: null,
      });
      setImagePreview(product.image || null);
    }
  }, [isEdit, product]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();

    // Add all fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('currency', formData.currency);
    formDataToSend.append('subcategory', formData.subcategory);
    formDataToSend.append('defaultSize', formData.defaultSize);
    formDataToSend.append('defaultColor', formData.defaultColor);
    formDataToSend.append('bestSeller', formData.bestSeller);
    formDataToSend.append('newArrival', formData.newArrival);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('discount', formData.discount);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('categoryId', formData.categoryId);

    // Parse arrays
    const sizesArray = formData.sizes.split(",").map((s) => s.trim()).filter(s => s);
    const colorsArray = formData.colors.split(",").map((c) => c.trim()).filter(c => c);
    const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(t => t);

    formDataToSend.append('sizes', JSON.stringify(sizesArray));
    formDataToSend.append('colors', JSON.stringify(colorsArray));
    formDataToSend.append('tags', JSON.stringify(tagsArray));

    // Add image if present
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const token = getToken();
      const url = isEdit
        ? `${baseUrl}products`
        : `${baseUrl}products`;

      const method = isEdit ? "PATCH" : "POST";

      // For edit, we need to send id and value
      if (isEdit) {
        const updateData = {
          id: product.id,
          value: {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            currency: formData.currency,
            subcategory: formData.subcategory,
            defaultSize: formData.defaultSize,
            defaultColor: formData.defaultColor,
            bestSeller: formData.bestSeller,
            newArrival: formData.newArrival,
            rating: parseFloat(formData.rating),
            discount: parseFloat(formData.discount),
            stock: parseInt(formData.stock),
            categoryId: parseInt(formData.categoryId),
            sizes: sizesArray,
            colors: colorsArray,
            tags: tagsArray,
          }
        };

        // If image is changed, handle it separately or include in update
        if (formData.image) {
          // For now, we'll need to update the backend to support image update via PATCH
          toast.warning("Image update not yet supported in edit mode");
        }

        const res = await fetch(url, {
          method: method,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updateData),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Product updated successfully!");
          if (onSuccess) onSuccess();
          if (closeModal) {
            setTimeout(() => closeModal(), 1500);
          }
        } else {
          toast.error(data.message || "Failed to update product");
        }
      } else {
        const res = await fetch(url, {
          method: method,
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formDataToSend,
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Product created successfully!");
          // Reset form
          setFormData({
            name: "",
            description: "",
            price: "",
            currency: "USD",
            sizes: "",
            defaultSize: "",
            colors: "",
            defaultColor: "",
            bestSeller: false,
            subcategory: "",
            rating: "0",
            discount: "0",
            newArrival: false,
            tags: "",
            stock: "0",
            categoryId: "",
            image: null,
          });
          setImagePreview(null);
          if (onSuccess) onSuccess();
          if (closeModal) {
            setTimeout(() => closeModal(), 1500);
          }
        } else {
          toast.error(data.message || "Failed to create product");
        }
      }
    } catch (error) {
      toast.error(error?.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-auto"
        onSubmit={handleSubmit}
      >
        {/* Product Name */}
        <input
          name="name"
          placeholder="Product Name *"
          value={formData.name}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Subcategory */}
        <input
          name="subcategory"
          placeholder="Subcategory (e.g., Men, Women, Kids) *"
          value={formData.subcategory}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description *"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          className="border rounded p-2 col-span-1 md:col-span-2 focus:ring-2 focus:ring-primary"
        />

        {/* Price */}
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price *"
          value={formData.price}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Stock/Quantity */}
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity *"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Currency */}
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Currency *</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="NGN">NGN (₦)</option>
        </select>

        {/* Category */}
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Category *</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sizes */}
        <input
          name="sizes"
          placeholder="Available Sizes (e.g., S, M, L, XL) *"
          value={formData.sizes}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Default Size */}
        <input
          name="defaultSize"
          placeholder="Default Size (e.g., M) *"
          value={formData.defaultSize}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Colors */}
        <input
          name="colors"
          placeholder="Available Colors (e.g., Red, Blue, Green) *"
          value={formData.colors}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Default Color */}
        <input
          name="defaultColor"
          placeholder="Default Color (e.g., Red) *"
          value={formData.defaultColor}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Rating */}
        <input
          type="number"
          step="0.01"
          min="0"
          max="5"
          name="rating"
          placeholder="Rating (0-5)"
          value={formData.rating}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Discount */}
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          name="discount"
          placeholder="Discount Percentage (0-100%)"
          value={formData.discount}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        {/* Tags */}
        <input
          name="tags"
          placeholder="Tags (e.g., summer, casual, trending)"
          value={formData.tags}
          onChange={handleChange}
          className="border rounded p-2 col-span-1 md:col-span-2 focus:ring-2 focus:ring-primary"
        />

        {/* Image Upload */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2 font-semibold">
            Product Image {!isEdit && '*'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!isEdit}
            className="border rounded p-2 w-full focus:ring-2 focus:ring-primary"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4 col-span-1 md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="bestSeller"
              checked={formData.bestSeller}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Mark as Best Seller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="newArrival"
              checked={formData.newArrival}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Mark as New Arrival</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`text-white px-4 py-2 col-span-1 md:col-span-2 rounded transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
        </button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ProductForm;
