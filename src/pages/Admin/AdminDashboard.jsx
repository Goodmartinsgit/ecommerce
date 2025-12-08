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
  FaEye,
  FaTimes,
  FaTruck,
  FaCheckCircle,
  FaUser,
  FaMapMarkerAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { productData, HandleGetProducts } = useContext(ProductContext);
  const products = productData || [];

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // New Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);

  const [productPage, setProductPage] = useState(1);
  const [userPage] = useState(1);
  const [orderPage] = useState(1);
  const itemsPerPage = 10;

  const [productSearch, setProductSearch] = useState("");
  const [productSort, setProductSort] = useState("name");
  const [productFilter, setProductFilter] = useState("all");

  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      const [userStatsRes, orderStatsRes] = await Promise.all([
        fetch(`${baseUrl}users/admin/stats`, { headers }),
        fetch(`${baseUrl}orders/admin/stats`, { headers }),
      ]);

      if (userStatsRes.status === 429 || orderStatsRes.status === 429) return;
      if (userStatsRes.status === 500 || orderStatsRes.status === 500) return;

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

  const updateOrderStatus = async (orderId, updateData) => {
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
          body: JSON.stringify(updateData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Order updated successfully!");
        fetchOrders(orderPage);
        // If modal is open, refresh it
        if (selectedOrder && selectedOrder.orderId === orderId) {
          fetchOrderDetails(orderId);
        }
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

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
        toast.success("Product deleted successfully!");
        handleProductSuccess();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleProductSuccess = () => {
    HandleGetProducts();
    fetchStats();
  };

  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const openOrderModal = async (order) => {
    // Determine the order ID to use (handle both string orderId and internal id)
    // The table passes the order object from the list
    setSelectedOrder(order); 
    setShowOrderModal(true);
    // Fetch full details including tracking and user address
    await fetchOrderDetails(order.orderId);
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  useEffect(() => {
    HandleGetProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (products && products.length >= 0) fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products?.length]);

  useEffect(() => {
    if (activeTab === "users") fetchUsers(userPage);
    else if (activeTab === "orders") fetchOrders(orderPage);
  }, [activeTab, userPage, orderPage]);

  // Filters (Product, User, Order)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (productSearch) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(productSearch.toLowerCase())
      );
    }
    if (productFilter !== "all") {
      if (productFilter === "bestSeller") filtered = filtered.filter(p => p.bestSeller);
      else if (productFilter === "newArrival") filtered = filtered.filter(p => p.newArrival);
      else if (productFilter === "lowStock") filtered = filtered.filter(p => (p.stock || 0) < 10);
    }
    filtered.sort((a, b) => {
      switch (productSort) {
        case "name": return a.name.localeCompare(b.name);
        case "price-low": return parseFloat(a.price) - parseFloat(b.price);
        case "price-high": return parseFloat(b.price) - parseFloat(a.price);
        case "stock-low": return (a.stock || 0) - (b.stock || 0);
        case "stock-high": return (b.stock || 0) - (a.stock || 0);
        default: return 0;
      }
    });
    return filtered;
  }, [products, productSearch, productFilter, productSort]);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    if (userSearch) {
      filtered = filtered.filter(u =>
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      );
    }
    if (userFilter !== "all") filtered = filtered.filter(u => u.role === userFilter);
    return filtered;
  }, [users, userSearch, userFilter]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (orderSearch) {
      filtered = filtered.filter(o =>
        o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
        `${o.user.firstname} ${o.user.lastname}`.toLowerCase().includes(orderSearch.toLowerCase())
      );
    }
    if (orderFilter !== "all") filtered = filtered.filter(o => o.status === orderFilter);
    return filtered;
  }, [orders, orderSearch, orderFilter]);

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
              
              {/* Recent Products */}
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
              {/* Products Table (Simplified for brevity) */}
              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b p-2">Name</th>
                        <th className="border-b p-2">Price</th>
                        <th className="border-b p-2">Stock</th>
                        <th className="border-b p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-100">
                          <td className="p-2">{prod.name}</td>
                          <td className="p-2">${prod.price}</td>
                          <td className="p-2">{prod.stock}</td>
                          <td className="p-2 flex gap-2">
                            <button onClick={() => openProductModal(prod)} className="text-blue-600"><FaEdit /></button>
                            <button onClick={() => deleteProduct(prod.id)} className="text-red-600"><FaTrash /></button>
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Users</h1>
              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b p-2">Name</th>
                        <th className="border-b p-2">Email</th>
                        <th className="border-b p-2">Role</th>
                        <th className="border-b p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-100">
                          <td className="p-2">{user.firstname} {user.lastname}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.role}</td>
                          <td className="p-2">
                            <button onClick={() => openUserModal(user)} className="text-blue-600 hover:text-blue-800">
                              <FaEye /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Orders</h1>
              <div className="bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b p-2">Order ID</th>
                        <th className="border-b p-2">Customer</th>
                        <th className="border-b p-2">Amount</th>
                        <th className="border-b p-2">Status</th>
                        <th className="border-b p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-100">
                          <td className="p-2 font-mono text-sm">{order.orderId}</td>
                          <td className="p-2">{order.user.firstname} {order.user.lastname}</td>
                          <td className="p-2">${order.amount}</td>
                          <td className="p-2">
                             <span className={`px-2 py-1 rounded text-xs border ${
                                  order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                  order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                  order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                  "bg-blue-100 text-blue-700"
                                }`}>
                                  {order.status}
                                </span>
                          </td>
                          <td className="p-2">
                            <button onClick={() => openOrderModal(order)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              <FaEye /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
            <div className="bg-white w-full max-w-5xl rounded-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setSelectedProduct(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <FaTimes size={24} />
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

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
            <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <FaTimes size={24} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Order Info</h3>
                  <p><span className="text-gray-600">ID:</span> {selectedOrder.orderId}</p>
                  <p><span className="text-gray-600">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><span className="text-gray-600">Status:</span> 
                    <span className={`ml-2 px-2 py-0.5 rounded text-sm ${
                      selectedOrder.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><span className="text-gray-600">Total:</span> <span className="font-bold text-lg">₦{Number(selectedOrder.amount).toLocaleString()}</span></p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Customer</h3>
                  <p><span className="text-gray-600">Name:</span> {selectedOrder.user?.firstname} {selectedOrder.user?.lastname}</p>
                  <p><span className="text-gray-600">Email:</span> {selectedOrder.user?.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {selectedOrder.user?.phone}</p>
                  <p><span className="text-gray-600">Address:</span> {selectedOrder.user?.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems?.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-3 flex items-center gap-2">
                             {item.product?.image && <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded" />}
                             {item.product?.name || 'Product'}
                          </td>
                          <td className="p-3">₦{Number(item.price).toLocaleString()}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">₦{Number(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Update & Tracking */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Update Status</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    updateOrderStatus(selectedOrder.orderId, {
                      status: formData.get('status'),
                      trackingNumber: formData.get('trackingNumber'),
                      location: formData.get('location'),
                      description: formData.get('description')
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select 
                        name="status" 
                        defaultValue={selectedOrder.status}
                        className="w-full p-2 border rounded"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tracking Number</label>
                      <input 
                        name="trackingNumber" 
                        defaultValue={selectedOrder.trackingNumber}
                        placeholder="e.g. TRK123456789"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Location</label>
                      <input 
                        name="location" 
                        placeholder="e.g. Lagos Sorting Hub"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input 
                        name="description" 
                        placeholder="e.g. Package arrived at facility"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                    Update Status
                  </button>
                </form>

                {/* Tracking History */}
                {selectedOrder.trackingHistory?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Tracking History</h4>
                    <div className="space-y-3">
                      {selectedOrder.trackingHistory.map((track, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <div className="text-gray-500 w-32 shrink-0">
                            {new Date(track.createdAt).toLocaleString()}
                          </div>
                          <div>
                            <span className={`font-semibold ${
                              track.status === 'DELIVERED' ? 'text-green-600' : 'text-blue-600'
                            }`}>{track.status}</span>
                            {track.location && <span className="text-gray-600"> - {track.location}</span>}
                            <p className="text-gray-600">{track.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
             <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <FaTimes size={24} />
              </button>
              
              <div className="text-center mb-6">
                 <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    {selectedUser.image ? (
                        <img src={selectedUser.image} alt="" className="w-full h-full rounded-full object-cover"/>
                    ) : (
                        <FaUser className="text-4xl text-gray-400" />
                    )}
                 </div>
                 <h2 className="text-2xl font-bold">{selectedUser.firstname} {selectedUser.lastname}</h2>
                 <p className="text-gray-500">{selectedUser.email}</p>
                 <span className={`inline-block mt-2 px-3 py-1 rounded text-xs font-semibold ${
                    selectedUser.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                 }`}>
                    {selectedUser.role}
                 </span>
              </div>
              
              <div className="space-y-3 border-t pt-4">
                 <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">{selectedUser.phone || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Address</span>
                    <span className="font-medium text-right max-w-[60%]">{selectedUser.address || 'N/A'}</span>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t text-center">
                  <button 
                    onClick={() => {
                        setShowUserModal(false);
                        setActiveTab('orders');
                        setOrderSearch(selectedUser.email);
                    }}
                    className="text-primary hover:underline flex items-center justify-center gap-2 w-full"
                  >
                    View User Orders <FaShoppingCart />
                  </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default AdminDashboard;