import { useState, useContext, useEffect, useMemo } from "react";
import ProductContext from "../../context/NewProductContext";
import ProductForm from "../ProductForm";
import Layout from "../../shared/Layout/Layout";
import { baseUrl } from "../../config/config";
import { getToken } from "../../utils/auth";
import {
  FaPlusCircle,
  FaList,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaTachometerAlt,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSort,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { productData, HandleGetProducts } = useContext(ProductContext);
  const products = productData || [];

  // Active tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Admin data states
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [productPage, setProductPage] = useState(1);
  const [userPage] = useState(1);
  const [orderPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort states
  const [productSearch, setProductSearch] = useState("");
  const [productSort, setProductSort] = useState("name");
  const [productFilter, setProductFilter] = useState("all");

  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  // Fetch admin statistics
  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn('No token available for admin stats');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };

      const [userStatsRes, orderStatsRes] = await Promise.all([
        fetch(`${baseUrl}users/admin/stats`, { headers }),
        fetch(`${baseUrl}orders/admin/stats`, { headers }),
      ]);

      // Handle rate limiting and errors
      if (userStatsRes.status === 429 || orderStatsRes.status === 429) {
        console.warn('Rate limited - skipping admin stats fetch');
        return;
      }
      
      if (userStatsRes.status === 500 || orderStatsRes.status === 500) {
        console.warn('Server error - skipping admin stats fetch');
        // Set default stats to prevent UI issues
        setStats({
          totalUsers: 0,
          totalOrders: 0,
          totalProducts: products ? products.length : 0,
          totalRevenue: 0,
        });
        return;
      }

      const userStats = await userStatsRes.json();
      const orderStats = await orderStatsRes.json();

      if (userStats.success && orderStats.success) {
        setStats({
          totalUsers: userStats.data.totalUsers,
          totalOrders: orderStats.data.totalOrders,
          totalProducts: products ? products.length : 0,
          totalRevenue: orderStats.data.totalRevenue,
        });
      } else {
        console.warn('Admin stats fetch failed:', userStats.message || orderStats.message);
        // Set default stats on failure
        setStats({
          totalUsers: 0,
          totalOrders: 0,
          totalProducts: products ? products.length : 0,
          totalRevenue: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats on error
      setStats({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: products ? products.length : 0,
        totalRevenue: 0,
      });
    }
  };

  // Fetch all users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${baseUrl}users/admin/all?page=${page}&limit=${itemsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${baseUrl}orders/admin/all?page=${page}&limit=${itemsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${baseUrl}orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Order status updated successfully!");
        fetchOrders(orderPage);
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}products`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Product deleted successfully!");
        handleProductSuccess();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // Handle product creation/update success
  const handleProductSuccess = () => {
    HandleGetProducts();
    fetchStats();
  };

  // Open product modal for create/edit
  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  useEffect(() => {
    HandleGetProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (products && products.length >= 0) { // Allow 0 products
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products?.length]); // Only depend on products length to prevent infinite loops

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(userPage);
    } else if (activeTab === "orders") {
      fetchOrders(orderPage);
    }
  }, [activeTab, userPage, orderPage]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (productSearch) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(productSearch.toLowerCase())
      );
    }

    // Category filter
    if (productFilter !== "all") {
      if (productFilter === "bestSeller") {
        filtered = filtered.filter(p => p.bestSeller);
      } else if (productFilter === "newArrival") {
        filtered = filtered.filter(p => p.newArrival);
      } else if (productFilter === "lowStock") {
        filtered = filtered.filter(p => (p.stock || 0) < 10);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (productSort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "stock-low":
          return (a.stock || 0) - (b.stock || 0);
        case "stock-high":
          return (b.stock || 0) - (a.stock || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, productSearch, productFilter, productSort]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (userSearch) {
      filtered = filtered.filter(u =>
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      );
    }

    if (userFilter !== "all") {
      filtered = filtered.filter(u => u.role === userFilter);
    }

    return filtered;
  }, [users, userSearch, userFilter]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (orderSearch) {
      filtered = filtered.filter(o =>
        o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
        `${o.user.firstname} ${o.user.lastname}`.toLowerCase().includes(orderSearch.toLowerCase())
      );
    }

    if (orderFilter !== "all") {
      filtered = filtered.filter(o => o.status === orderFilter);
    }

    return filtered;
  }, [orders, orderSearch, orderFilter]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, productPage]);

  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const recentProducts = products ? products.slice(0, 5) : [];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { id: "products", label: "Manage Products", icon: FaBox },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "orders", label: "Orders", icon: FaShoppingCart },
  ];

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-primary text-white flex flex-col p-4 lg:p-6 lg:min-h-screen">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Granduer Admin</h2>
          <nav className="flex flex-row lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-md transition whitespace-nowrap text-sm lg:text-base ${
                    activeTab === item.id
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-10">
                {[
                  { title: "Total Products", icon: FaBox, value: stats.totalProducts },
                  { title: "Orders", icon: FaShoppingCart, value: stats.totalOrders },
                  { title: "Users", icon: FaUsers, value: stats.totalUsers },
                  { title: "Revenue", icon: FaTachometerAlt, value: stats.totalRevenue },
                ].map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <div key={index} className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="text-primary text-xl sm:text-2xl lg:text-3xl" />
                          <h3 className="font-semibold text-xs sm:text-sm lg:text-base">{card.title}</h3>
                        </div>
                        <p className="text-lg sm:text-xl font-bold">
                          {card.title === "Revenue"
                            ? `$${Number(card.value || 0).toFixed(2)}`
                            : Number(card.value || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
                <button
                  onClick={() => openProductModal()}
                  className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition"
                >
                  <FaPlusCircle className="text-primary text-4xl mb-3" />
                  <h3 className="text-xl font-semibold">Add Product</h3>
                </button>

                <button
                  onClick={() => setActiveTab("products")}
                  className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition"
                >
                  <FaList className="text-primary text-4xl mb-3" />
                  <h3 className="text-xl font-semibold">View All Products</h3>
                </button>
              </div>

              {/* Recent Products Table */}
              <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b p-2">Name</th>
                        <th className="border-b p-2">Price</th>
                        <th className="border-b p-2">Category</th>
                        <th className="border-b p-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => openProductModal(prod)}>
                          <td className="p-2">{prod.name}</td>
                          <td className="p-2">${prod.price}</td>
                          <td className="p-2">{prod.subcategory}</td>
                          <td className="p-2">{prod.stock || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Manage Products</h1>
                <button
                  onClick={() => openProductModal()}
                  className="bg-primary text-white px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 hover:bg-opacity-90 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <FaPlusCircle /> Add Product
                </button>
              </div>

              {/* Filters and Search */}
              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Products</option>
                    <option value="bestSeller">Best Sellers</option>
                    <option value="newArrival">New Arrivals</option>
                    <option value="lowStock">Low Stock</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={productSort}
                    onChange={(e) => setProductSort(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="stock-low">Stock: Low to High</option>
                    <option value="stock-high">Stock: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-6">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full text-left border-collapse text-sm sm:text-base">
                    <thead>
                      <tr>
                        <th className="border-b p-2">Image</th>
                        <th className="border-b p-2">Name</th>
                        <th className="border-b p-2">Price</th>
                        <th className="border-b p-2">Stock</th>
                        <th className="border-b p-2">Category</th>
                        <th className="border-b p-2">Status</th>
                        <th className="border-b p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-100">
                          <td className="p-2">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded cursor-pointer"
                              onClick={() => openProductModal(prod)}
                            />
                          </td>
                          <td className="p-2 cursor-pointer" onClick={() => openProductModal(prod)}>{prod.name}</td>
                          <td className="p-2">${prod.price}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              (prod.stock || 0) < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {prod.stock || 0}
                            </span>
                          </td>
                          <td className="p-2">{prod.subcategory}</td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              {prod.bestSeller && (
                                <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">Best</span>
                              )}
                              {prod.newArrival && (
                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">New</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProductModal(prod);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProduct(prod.id);
                                }}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((productPage - 1) * itemsPerPage) + 1} to {Math.min(productPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setProductPage(p => Math.max(1, p - 1))}
                      disabled={productPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1">
                      Page {productPage} of {totalProductPages}
                    </span>
                    <button
                      onClick={() => setProductPage(p => Math.min(totalProductPages, p + 1))}
                      disabled={productPage === totalProductPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab with filtering */}
          {activeTab === "users" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Users</h1>

              {/* User Filters */}
              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Users</option>
                    <option value="ADMIN">Admins Only</option>
                    <option value="USER">Regular Users</option>
                  </select>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-6">
                {loading ? (
                  <p className="text-center py-4 text-sm sm:text-base">Loading users...</p>
                ) : (
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <table className="w-full text-left border-collapse text-sm sm:text-base">
                      <thead>
                        <tr>
                          <th className="border-b p-2">Name</th>
                          <th className="border-b p-2">Email</th>
                          <th className="border-b p-2">Phone</th>
                          <th className="border-b p-2">Role</th>
                          <th className="border-b p-2">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-100">
                            <td className="p-2">{user.firstname} {user.lastname}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.phone}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab with filtering */}
          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Orders</h1>

              {/* Order Filters */}
              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Orders</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-6">
                {loading ? (
                  <p className="text-center py-4 text-sm sm:text-base">Loading orders...</p>
                ) : (
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <table className="w-full text-left border-collapse text-sm sm:text-base">
                      <thead>
                        <tr>
                          <th className="border-b p-2">Order ID</th>
                          <th className="border-b p-2">Customer</th>
                          <th className="border-b p-2">Amount</th>
                          <th className="border-b p-2">Status</th>
                          <th className="border-b p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-100">
                            <td className="p-2 font-mono text-sm">{order.orderId}</td>
                            <td className="p-2">{order.user.firstname} {order.user.lastname}</td>
                            <td className="p-2">${order.amount}</td>
                            <td className="p-2">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                className={`px-2 py-1 rounded text-xs border ${
                                  order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                  order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                  order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                  "bg-blue-100 text-blue-700"
                                }`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Product Modal (Create/Edit) */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
            <div className="bg-white w-full max-w-5xl rounded-lg sm:rounded-xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setSelectedProduct(null);
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-600 font-bold text-xl hover:text-red-500 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              >
                ✕
              </button>
              <ProductForm
                closeModal={() => {
                  setShowProductModal(false);
                  setSelectedProduct(null);
                }}
                onSuccess={handleProductSuccess}
                product={selectedProduct}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
