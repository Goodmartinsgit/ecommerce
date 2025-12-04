import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { baseUrl } from '../config/config';
import { getToken } from '../utils/auth';

const CreateProduct = ({ closeModal, onSuccess }) => {
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
    categoryId: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

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
      // Create preview
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

    // Create FormData for multipart/form-data
    const formDataToSend = new FormData();

    // Add all fields to FormData
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
    formDataToSend.append('categoryId', formData.categoryId);

    // Parse arrays and send as JSON strings
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
      const res = await fetch(`${baseUrl}products`, {
        method: "POST",
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
          categoryId: "",
          image: null,
        });
        setImagePreview(null);
        if (onSuccess) onSuccess(); // Refresh product list
        if (closeModal) {
          setTimeout(() => closeModal(), 1500); // Close modal after showing success message
        }
      } else {
        toast.error(data.message || "Failed to create product");
        console.error("Error details:", data);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to create product");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Add New Product</h2>
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

        {/* Currency */}
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="NGN">NGN</option>
        </select>

        {/* Category */}
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-primary col-span-1 md:col-span-2"
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
          placeholder="Sizes (e.g., S, M, L, XL) *"
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
          placeholder="Colors (e.g., Red, Blue, Green) *"
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
          placeholder="Discount (%)"
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
          <label className="block mb-2 font-semibold">Product Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
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
            <span>Best Seller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="newArrival"
              checked={formData.newArrival}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>New Arrival</span>
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
          {loading ? 'Creating Product...' : 'Create Product'}
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

export default CreateProduct;
