import { useState, useContext, useEffect } from "react";
import ProductContext from "../../context/NewProductContext";
import CreateProduct from "../CreateProduct";
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
} from "react-icons/fa";

const AdminDashboard = () => {
  const { productData, HandleGetProducts } = useContext(ProductContext);

  // Get products array from productData
  const products = productData || [];

  // Active tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
  const [userPage, setUserPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);

  // Fetch admin statistics
  const fetchStats = async () => {
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [userStatsRes, orderStatsRes] = await Promise.all([
        fetch(`${baseUrl}users/admin/stats`, { headers }),
        fetch(`${baseUrl}orders/admin/stats`, { headers }),
      ]);

      const userStats = await userStatsRes.json();
      const orderStats = await orderStatsRes.json();

      if (userStats.success && orderStats.success) {
        setStats({
          totalUsers: userStats.data.totalUsers,
          totalOrders: orderStats.data.totalOrders,
          totalProducts: products ? products.length : 0,
          totalRevenue: orderStats.data.totalRevenue,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch all users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${baseUrl}users/admin/all?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        `${baseUrl}orders/admin/all?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        HandleGetProducts(); // Refresh products
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // Handle product creation success
  const handleProductCreated = () => {
    HandleGetProducts(); // Refresh products
    fetchStats(); // Refresh stats
  };

  useEffect(() => {
    HandleGetProducts();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      fetchStats();
    }
  }, [products]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(userPage);
    } else if (activeTab === "orders") {
      fetchOrders(orderPage);
    }
  }, [activeTab, userPage, orderPage]);

  const recentProducts = products ? products.slice(0, 5) : [];

  // Sidebar navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { id: "products", label: "Manage Products", icon: FaBox },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "orders", label: "Orders", icon: FaShoppingCart },
  ];

  return (
    <Layout>
      <div className="md:flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-primary text-white flex flex-col p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-6">Granduer Admin</h2>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-md transition ${
                    activeTab === item.id
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`}
                >
                  <Icon /> {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  {
                    title: "Total Products",
                    icon: FaBox,
                    value: stats.totalProducts,
                  },
                  {
                    title: "Orders",
                    icon: FaShoppingCart,
                    value: stats.totalOrders,
                  },
                  { title: "Users", icon: FaUsers, value: stats.totalUsers },
                  {
                    title: "Revenue",
                    icon: FaTachometerAlt,
                    value: stats.totalRevenue,
                  },
                ].map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white shadow-md rounded-xl p-6"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="text-primary text-3xl" />
                          <h3 className="font-semibold">{card.title}</h3>
                        </div>
                        <p className="text-xl font-bold">
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
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <button
                  onClick={() => setShowCreateModal(true)}
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
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-100">
                          <td className="p-2">{prod.name}</td>
                          <td className="p-2">${prod.price}</td>
                          <td className="p-2">{prod.subcategory}</td>
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-opacity-90"
                >
                  <FaPlusCircle /> Add Product
                </button>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b p-2">Image</th>
                        <th className="border-b p-2">Name</th>
                        <th className="border-b p-2">Price</th>
                        <th className="border-b p-2">Category</th>
                        <th className="border-b p-2">Best Seller</th>
                        <th className="border-b p-2">New Arrival</th>
                        <th className="border-b p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products && products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-100">
                          <td className="p-2">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </td>
                          <td className="p-2">{prod.name}</td>
                          <td className="p-2">${prod.price}</td>
                          <td className="p-2">{prod.subcategory}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                prod.bestSeller
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {prod.bestSeller ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                prod.newArrival
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {prod.newArrival ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => deleteProduct(prod.id)}
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
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
              <div className="bg-white shadow-md rounded-xl p-6">
                {loading ? (
                  <p className="text-center py-4">Loading users...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
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
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-100">
                            <td className="p-2">
                              {user.firstname} {user.lastname}
                            </td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.phone}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  user.role === "ADMIN"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="p-2">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
              <div className="bg-white shadow-md rounded-xl p-6">
                {loading ? (
                  <p className="text-center py-4">Loading orders...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="border-b p-2">Order ID</th>
                          <th className="border-b p-2">Customer</th>
                          <th className="border-b p-2">Amount</th>
                          <th className="border-b p-2">Status</th>
                          <th className="border-b p-2">Date</th>
                          <th className="border-b p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-100">
                            <td className="p-2 font-mono text-sm">
                              {order.orderId}
                            </td>
                            <td className="p-2">
                              {order.user.firstname} {order.user.lastname}
                            </td>
                            <td className="p-2">${order.amount}</td>
                            <td className="p-2">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(order.orderId, e.target.value)
                                }
                                className={`px-2 py-1 rounded text-xs border ${
                                  order.status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : order.status === "CANCELLED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
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
                            <td className="p-2">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => alert(`View order details for ${order.orderId}`)}
                              >
                                View
                              </button>
                            </td>
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

        {/* Create Product Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-3 right-3 text-gray-600 font-bold text-xl hover:text-red-500"
              >
                ✕
              </button>
              <CreateProduct
                closeModal={() => setShowCreateModal(false)}
                onSuccess={handleProductCreated}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
