import { useState, useRef } from 'react';
import { 
  User, LogOut, ShoppingBag, Heart, Package, Settings, 
  ChevronRight, MapPin, CreditCard, Bell, Shield, Camera,
  TrendingUp, Clock, Check, Truck, X, Edit2, Save
} from 'lucide-react';

// Mock user data
const initialUser = {
  fullName: "John Anderson",
  email: "john.anderson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: null,
  address: "123 Fashion Street, NY 10001",
  joinDate: "January 2024"
};

// Mock data
const mockOrders = [
  { 
    id: "#ORD-2024-001", 
    date: "2024-01-20", 
    status: "Delivered", 
    amount: 125.99,
    items: 3,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=100&fit=crop"
  },
  { 
    id: "#ORD-2024-002", 
    date: "2024-01-18", 
    status: "Shipped", 
    amount: 89.99,
    items: 2,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop"
  },
  { 
    id: "#ORD-2024-003", 
    date: "2024-01-15", 
    status: "Processing", 
    amount: 45.50,
    items: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
  },
  { 
    id: "#ORD-2024-004", 
    date: "2024-01-10", 
    status: "Cancelled", 
    amount: 67.00,
    items: 2,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100&h=100&fit=crop"
  }
];

const mockWishlist = [
  {
    id: 1,
    name: "Classic Leather Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop",
    inStock: true
  },
  {
    id: 2,
    name: "Designer Sunglasses",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop",
    inStock: true
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    inStock: false
  },
  {
    id: 4,
    name: "Minimalist Backpack",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    inStock: true
  }
];

// Status badge component
const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Shipped: "bg-blue-100 text-blue-700 border-blue-200",
    Processing: "bg-amber-100 text-amber-700 border-amber-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200"
  };
  
  const icons = {
    Delivered: Check,
    Shipped: Truck,
    Processing: Clock,
    Cancelled: X
  };
  
  const Icon = icons[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      <Icon size={14} />
      {status}
    </span>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "orders", label: "My Orders", icon: ShoppingBag, badge: 3 },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: 4 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Profile Section */}
      <div className="bg-gradient-to-br from-black to-gray-800 p-6 text-white">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-4 border-white/30">
                {user.fullName.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="font-bold text-lg text-center">{user.fullName}</h3>
          <p className="text-white/80 text-sm text-center mt-1">Member since {user.joinDate}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? "bg-black text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-gray-400"} />
              <span className="font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight size={16} className={activeTab === item.id ? "text-white" : "text-gray-400"} />
            </div>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

// Overview Component
const Overview = ({ orders }) => {
  const stats = [
    { 
      icon: ShoppingBag, 
      label: "Total Orders", 
      value: orders.length.toString(), 
      change: "+12%",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: Package, 
      label: "Processing", 
      value: orders.filter(o => o.status === "Processing").length.toString(), 
      change: "-3%",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: Heart, 
      label: "Wishlist Items", 
      value: "4", 
      change: "+5%",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.color} text-white p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Track your latest purchases</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 3).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={order.image} 
                        alt="Product" 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="text-sm text-gray-600">{order.items} items</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{order.date}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900">${order.amount.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Orders Component
const Orders = ({ orders }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === filter);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track all your orders</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'delivered', 'shipped', 'processing'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders found for this filter</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <img 
                  src={order.image} 
                  alt="Product" 
                  className="w-full lg:w-24 h-40 lg:h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900 mb-1">{order.id}</p>
                      <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-gray-600">{order.items} items</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-bold text-gray-900 text-lg">${order.amount.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      Track Order
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Wishlist Component
const Wishlist = ({ items }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <p className="text-sm text-gray-500 mt-1">{items.length} saved items</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                      Out of Stock
                    </span>
                  </div>
                )}
                <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
                  <Heart size={20} className="text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-3">${item.price}</p>
                <button 
                  disabled={!item.inStock}
                  className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    item.inStock
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {item.inStock ? 'Add to Cart' : 'Notify Me'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Component
const SettingsPage = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const fileInputRef = useRef(null);

  const handleSave = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsEditing(false);
    onUpdate(formData);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = { ...formData, avatar: reader.result };
        setFormData(newData);
        onUpdate(newData);
        alert('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('Please fill in all password fields');
      return;
    }
    
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    alert('Password changed successfully!');
    setShowPassword(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center text-3xl font-bold text-white">
                {formData.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
            >
              <Camera size={18} />
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="hidden" 
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Choose File
            </button>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  <Save size={16} /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your full name"
              className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                isEditing 
                  ? 'border-gray-300 focus:border-black bg-white' 
                  : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your email"
              className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                isEditing 
                  ? 'border-gray-300 focus:border-indigo-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={!isEditing}
              placeholder="+1 (555) 123-4567"
              className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                isEditing 
                  ? 'border-gray-300 focus:border-indigo-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your address"
              className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                isEditing 
                  ? 'border-gray-300 focus:border-indigo-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Changes will be saved to your profile. Make sure all information is correct.
            </p>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Security</h3>
            <p className="text-sm text-gray-500 mt-1">Manage your password and security settings</p>
          </div>
          {!showPassword && (
            <button
              onClick={() => setShowPassword(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Shield size={16} /> Change Password
            </button>
          )}
        </div>
        
        {showPassword && (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                placeholder="Enter current password"
                className="w-full p-3 rounded-lg border-2 border-gray-300 outline-none focus:border-black transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                placeholder="Enter new password"
                className="w-full p-3 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                placeholder="Confirm new password"
                className="w-full p-3 rounded-lg border-2 border-gray-300 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handlePasswordChange}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <Save size={16} /> Update Password
              </button>
              <button
                onClick={() => {
                  setShowPassword(false);
                  setPasswordData({ current: '', new: '', confirm: '' });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 text-left group">
          <Bell size={24} className="text-black mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-gray-900 mb-1">Notification Settings</h4>
          <p className="text-sm text-gray-500">Manage your email and push notifications</p>
        </button>
        
        <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 text-left group">
          <CreditCard size={24} className="text-black mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-gray-900 mb-1">Payment Methods</h4>
          <p className="text-sm text-gray-500">Manage your saved payment cards</p>
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function ModernDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(initialUser);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out...');
      // In a real app, clear auth tokens and redirect to login
    }
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user.fullName}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              user={user}
              onLogout={handleLogout}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && <Overview orders={mockOrders} />}
            {activeTab === "orders" && <Orders orders={mockOrders} />}
            {activeTab === "wishlist" && <Wishlist items={mockWishlist} />}
            {activeTab === "settings" && <SettingsPage user={user} onUpdate={handleUpdateUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}