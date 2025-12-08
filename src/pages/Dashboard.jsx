import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../shared/Layout/Layout";
import ProductContext from "../context/NewProductContext";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  Settings,
  LogOut,
  ShoppingBag,
  Clock,
  TrendingUp,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Eye,
  Lock,
  Mail,
  Phone,
  Home,
  Star
} from "lucide-react";
import { toast } from "react-toastify";
import { baseUrl } from "../config/config";

export default function Dashboard() {
  const { user, HandleLogout, isAuthenticated, HandleGetWishlist, wishlistCount } = useContext(ProductContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });
  const initialFetchDone = useRef(false);

  // Set active section from URL parameter
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const validSections = ['overview', 'orders', 'wishlist', 'addresses', 'profile', 'settings'];
      if (validSections.includes(section)) {
        setActiveSection(section);
      }
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isAuthenticated || !token) {
      toast.error("Please login to access dashboard");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch user data on mount
  useEffect(() => {
    if (isAuthenticated && user?.id && !loading && !initialFetchDone.current) {
      initialFetchDone.current = true;
      setLoading(true);
      Promise.all([
        fetchOrders(),
        fetchAddresses(), 
        fetchStats(),
        HandleGetWishlist()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [isAuthenticated, user?.id]); // Only depend on user ID to prevent infinite loops

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 429) {
        console.warn('Rate limited - skipping orders fetch');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 429) {
        console.warn('Rate limited - skipping addresses fetch');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token available for stats fetch');
        return;
      }
      
      const res = await fetch(`${baseUrl}orders/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 429) {
        console.warn('Rate limited - skipping stats fetch');
        return;
      }
      
      if (res.status === 401) {
        console.warn('Unauthorized - invalid token');
        HandleLogout(); // Logout if token is invalid
        return;
      }
      
      if (res.status === 500) {
        console.warn('Server error - skipping stats fetch');
        // Set default stats to prevent UI issues
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalSpent: 0
        });
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        console.warn('Stats fetch failed:', data.message);
        // Set default stats on failure
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalSpent: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default stats on error
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpent: 0
      });
    }
  };

  const handleLogout = () => {
    HandleLogout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-black rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  {user.image ? (
                    <img src={user.image} alt={user.firstname} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-black" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, {user.firstname}!</h1>
                  <p className="text-gray-300">Manage your account and orders</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
                <nav className="space-y-1">
                  <NavButton
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    label="Overview"
                    active={activeSection === "overview"}
                    onClick={() => setActiveSection("overview")}
                  />
                  <NavButton
                    icon={<Package className="w-5 h-5" />}
                    label="My Orders"
                    active={activeSection === "orders"}
                    onClick={() => setActiveSection("orders")}
                    badge={stats.pendingOrders}
                  />
                  <NavButton
                    icon={<Heart className="w-5 h-5" />}
                    label="Wishlist"
                    active={activeSection === "wishlist"}
                    onClick={() => setActiveSection("wishlist")}
                    badge={wishlistCount}
                  />
                  <NavButton
                    icon={<MapPin className="w-5 h-5" />}
                    label="Addresses"
                    active={activeSection === "addresses"}
                    onClick={() => setActiveSection("addresses")}
                  />
                  <NavButton
                    icon={<User className="w-5 h-5" />}
                    label="Profile"
                    active={activeSection === "profile"}
                    onClick={() => setActiveSection("profile")}
                  />
                  <NavButton
                    icon={<Settings className="w-5 h-5" />}
                    label="Settings"
                    active={activeSection === "settings"}
                    onClick={() => setActiveSection("settings")}
                  />
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {activeSection === "overview" && (
                <OverviewSection
                  stats={stats}
                  orders={orders}
                  user={user}
                  onNavigate={setActiveSection}
                />
              )}
              {activeSection === "orders" && (
                <OrdersSection
                  orders={orders}
                  onRefresh={fetchOrders}
                />
              )}
              {activeSection === "wishlist" && <WishlistSection />}
              {activeSection === "addresses" && (
                <AddressesSection
                  addresses={addresses}
                  onRefresh={fetchAddresses}
                />
              )}
              {activeSection === "profile" && <ProfileSection user={user} />}
              {activeSection === "settings" && <SettingsSection user={user} />}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Navigation Button Component
function NavButton({ icon, label, active, onClick, badge }) {
  const isWishlist = label === "Wishlist";
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
        active
          ? "bg-black text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {badge > 0 && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          isWishlist ? "bg-orange-500 text-white" : (active ? "bg-white text-black" : "bg-gray-200 text-black")
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// Overview Section
function OverviewSection({ stats, orders, onNavigate }) {
  const { wishlistCount } = useContext(ProductContext);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Package className="w-6 h-6 text-blue-600" />}
          label="Total Orders"
          value={stats.totalOrders}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          label="Pending"
          value={stats.pendingOrders}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<ShoppingBag className="w-6 h-6 text-green-600" />}
          label="Completed"
          value={stats.completedOrders}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          label="Wishlist"
          value={wishlistCount}
          bgColor="bg-red-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          label="Total Spent"
          value={`₦${stats.totalSpent?.toLocaleString() || 0}`}
          bgColor="bg-purple-50"
          isWide={true}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            icon={<Package className="w-6 h-6" />}
            label="Track Order"
            onClick={() => onNavigate("orders")}
          />
          <QuickAction
            icon={<Heart className="w-6 h-6" />}
            label="View Wishlist"
            onClick={() => onNavigate("wishlist")}
            badge={wishlistCount}
          />
          <QuickAction
            icon={<MapPin className="w-6 h-6" />}
            label="Add Address"
            onClick={() => onNavigate("addresses")}
          />
          <QuickAction
            icon={<User className="w-6 h-6" />}
            label="Edit Profile"
            onClick={() => onNavigate("profile")}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <button
            onClick={() => onNavigate("orders")}
            className="text-black hover:text-gray-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Quick Action Component
function QuickAction({ icon, label, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all group"
    >
      {badge > 0 && (
        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="text-gray-600 group-hover:text-black transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-black">
        {label}
      </span>
    </button>
  );
}

// Order Card Component
function OrderCard({ order, compact = false, onViewDetails, onWriteReview }) {
  const getStatusInfo = (status) => {
    const statusUpper = status?.toUpperCase() || 'PENDING';
    switch (statusUpper) {
      case 'PENDING':
        return { color: 'bg-orange-100 text-orange-700', label: 'Pending' };
      case 'PROCESSING':
        return { color: 'bg-blue-100 text-blue-700', label: 'Processing' };
      case 'SHIPPED':
        return { color: 'bg-purple-100 text-purple-700', label: 'Shipped' };
      case 'DELIVERED':
        return { color: 'bg-green-100 text-green-700', label: 'Delivered' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-700', label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: status || 'Unknown' };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const canReview = order.status?.toUpperCase() === 'DELIVERED' && !order.hasReview;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold">Order #{order.orderId}</p>
          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">₦{order.amount?.toLocaleString()}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
      {!compact && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onViewDetails(order)}
            className="flex-1 text-sm border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 font-medium"
          >
            View Details
          </button>
          {canReview && (
            <button
              onClick={() => onWriteReview(order)}
              className="flex-1 text-sm bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center gap-1"
            >
              <Star className="w-4 h-4" />
              Write Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Orders Section
function OrdersSection({ orders, onRefresh }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleWriteReview = (order) => {
    setReviewOrder(order);
    setShowReviewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">No orders found</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={handleViewDetails}
                onWriteReview={handleWriteReview}
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
      
      {showReviewModal && reviewOrder && (
        <ReviewModal 
          order={reviewOrder}
          onClose={() => {
            setShowReviewModal(false);
            setReviewOrder(null);
          }}
          onSubmit={() => {
            onRefresh();
            setShowReviewModal(false);
            setReviewOrder(null);
          }}
        />
      )}
    </div>
  );
}

// Wishlist, Addresses, Profile, Settings sections continue in next files...
function WishlistSection() {
  const { wishlistItems, HandleToggleWishlist, HandleAddToCart, HandleGetWishlist } = useContext(ProductContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      await HandleGetWishlist();
      setLoading(false);
    };
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Wishlist</h2>
          <p className="text-gray-500 mt-1">
            {wishlistItems?.length || 0} {wishlistItems?.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {wishlistItems?.length > 0 && (
          <button
            onClick={() => navigate('/')}
            className="text-black hover:text-gray-700 font-medium flex items-center gap-1"
          >
            Continue Shopping
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {!wishlistItems || wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Save items you love by clicking the heart icon on any product
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Discover Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <WishlistCard 
              key={product.id} 
              product={product} 
              onRemove={() => HandleToggleWishlist(product)}
              onAddToCart={() => HandleAddToCart(product, 1, product.defaultSize, product.defaultColor)}
              onViewProduct={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesSection({ addresses }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No saved addresses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistCard({ product, onRemove, onAddToCart, onViewProduct }) {
  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount 
    ? (originalPrice * (1 - product.discount / 100)).toFixed(0) 
    : originalPrice;

  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
          onClick={onViewProduct}
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all"
          title="Remove from wishlist"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-1 cursor-pointer hover:text-gray-700 line-clamp-1" 
          onClick={onViewProduct}
        >
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">
              ₦{Number(discountedPrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ₦{Number(originalPrice).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onAddToCart}
          className="mt-3 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function AddressCard({ address }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-gray-500" />
          <span className="font-semibold">{address.label}</span>
        </div>
        {address.isDefault && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Default
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{address.fullName}</p>
      <p className="text-sm text-gray-600">{address.addressLine1}</p>
      {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
      <p className="text-sm text-gray-600">{address.city}, {address.state} {address.postalCode}</p>
      <p className="text-sm text-gray-600">{address.phone}</p>
    </div>
  );
}

function ProfileSection({ user }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="space-y-4">
        <InfoRow icon={<User />} label="Name" value={`${user.firstname} ${user.lastname}`} />
        <InfoRow icon={<Mail />} label="Email" value={user.email} />
        <InfoRow icon={<Phone />} label="Phone" value={user.phone} />
        <InfoRow icon={<Home />} label="Address" value={user.address} />
      </div>
      <button className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
        <Edit className="w-4 h-4" />
        Edit Profile
      </button>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-gray-500">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function SettingsSection() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="space-y-4">
        <button
          onClick={() => setShowPasswordChange(!showPasswordChange)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Change Password</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {showPasswordChange && <PasswordChangeForm />}
      </div>
    </div>
  );
}

function PasswordChangeForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully");
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <input
        type="password"
        placeholder="Current Password"
        value={formData.currentPassword}
        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
      >
        Update Password
      </button>
    </form>
  );
}

// Order Details Modal
function OrderDetailsModal({ order, onClose }) {
  const getOrderStages = (status) => {
    const stages = [
      { key: 'PENDING', label: 'Order Placed', icon: <Package className="w-4 h-4" /> },
      { key: 'PROCESSING', label: 'Processing', icon: <Clock className="w-4 h-4" /> },
      { key: 'SHIPPED', label: 'Shipped', icon: <TrendingUp className="w-4 h-4" /> },
      { key: 'DELIVERED', label: 'Delivered', icon: <ShoppingBag className="w-4 h-4" /> }
    ];
    
    // Find the current status index
    const statusUpper = status?.toUpperCase() || 'PENDING';
    const currentIndex = stages.findIndex(s => s.key === statusUpper);
    
    return stages.map((stage, index) => ({
      ...stage,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const getStatusInfo = (status) => {
    const statusUpper = status?.toUpperCase() || 'PENDING';
    switch (statusUpper) {
      case 'PENDING': return { color: 'text-orange-600', label: 'Pending' };
      case 'PROCESSING': return { color: 'text-blue-600', label: 'Processing' };
      case 'SHIPPED': return { color: 'text-purple-600', label: 'Shipped' };
      case 'DELIVERED': return { color: 'text-green-600', label: 'Delivered' };
      case 'CANCELLED': return { color: 'text-red-600', label: 'Cancelled' };
      default: return { color: 'text-gray-600', label: status || 'Unknown' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold">#{order.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-lg">₦{order.amount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-semibold ${statusInfo.color}`}>{statusInfo.label}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Order Progress</h3>
            <div className="space-y-4">
              {getOrderStages(order.status).map((stage) => (
                <div key={stage.key} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.completed ? 'bg-green-500 text-white' : 
                    stage.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stage.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      stage.completed ? 'text-green-700' : 
                      stage.active ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {stage.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {(order.trackingNumber || (order.trackingHistory && order.trackingHistory.length > 0)) && (
            <div className="bg-gray-50 p-4 rounded-lg">
               <h3 className="font-semibold mb-2">Tracking Information</h3>
               {order.trackingNumber && (
                   <div className="mb-3">
                      <p className="text-xs text-gray-500">Tracking Number</p>
                      <p className="font-mono font-medium">{order.trackingNumber}</p>
                   </div>
               )}
               
               {order.trackingHistory && order.trackingHistory.length > 0 && (
                 <div className="space-y-3 mt-3 border-t pt-3">
                    {order.trackingHistory.map((history, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                            <div className="min-w-[80px] text-gray-500 text-xs">
                                {new Date(history.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{history.status}</p>
                                <p className="text-gray-600">{history.description} {history.location && ` - ${history.location}`}</p>
                            </div>
                        </div>
                    ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Review Modal
function ReviewModal({ order, onClose, onSubmit }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get order items (products in this order)
  const orderItems = order.items || order.orderItems || [];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error('Please select a product to review');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('orderId', order.id);
      formData.append('productId', selectedProduct.productId || selectedProduct.id);
      formData.append('rating', rating);
      formData.append('comment', comment);
      images.forEach(image => formData.append('images', image));
      
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('Review submitted successfully');
        onSubmit();
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Write Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          {orderItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Select Product to Review</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orderItems.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedProduct(item)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedProduct === item 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {item.product?.image && (
                      <img 
                        src={item.product.image} 
                        alt={item.product?.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{item.product?.name || item.name || 'Product'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    {selectedProduct === item && (
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
              placeholder="Share your experience with this product..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Images (Optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedProduct}
              className="flex-1 bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
