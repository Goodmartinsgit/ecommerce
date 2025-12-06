import { useState, useEffect, useContext } from "react";
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
  Home
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
    if (isAuthenticated && user && !loading) {
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
  }, [isAuthenticated, user]);

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
      const res = await fetch(`${baseUrl}orders/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 429) {
        console.warn('Rate limited - skipping stats fetch');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
function OverviewSection({ stats, orders, user, onNavigate }) {
  const { wishlistCount } = useContext(ProductContext);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="w-6 h-6 text-black" />}
          label="Total Orders"
          value={stats.totalOrders}
          bgColor="bg-gray-100"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-black" />}
          label="Pending"
          value={stats.pendingOrders}
          bgColor="bg-gray-100"
        />
        <StatCard
          icon={<ShoppingBag className="w-6 h-6 text-black" />}
          label="Completed"
          value={stats.completedOrders}
          bgColor="bg-gray-100"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-black" />}
          label="Total Spent"
          value={`₦${stats.totalSpent?.toLocaleString() || 0}`}
          bgColor="bg-gray-100"
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
function OrderCard({ order, compact = false }) {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Order #{order.orderId}</p>
          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">₦{order.amount?.toLocaleString()}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>
    </div>
  );
}

// Orders Section - Full implementation will follow
function OrdersSection({ orders, onRefresh }) {
  return (
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
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

// Wishlist, Addresses, Profile, Settings sections continue in next files...
function WishlistSection() {
  const { wishlistItems, HandleToggleWishlist, HandleAddToCart, HandleGetWishlist } = useContext(ProductContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      await HandleGetWishlist();
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <span className="text-sm text-gray-500">{wishlistItems?.length || 0} items</span>
      </div>
      
      {!wishlistItems || wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Start Shopping
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

function AddressesSection({ addresses, onRefresh }) {
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
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={onViewProduct}
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 cursor-pointer hover:text-gray-700" onClick={onViewProduct}>
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-black">₦{product.price}</span>
          <button
            onClick={onAddToCart}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
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

function SettingsSection({ user }) {
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
    } catch (error) {
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
