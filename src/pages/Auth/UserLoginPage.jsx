import { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../shared/Layout/Layout";
import { Eye, EyeOff, LogIn, User, Settings, Loader2 } from "lucide-react";
import ProductContext from "../../context/NewProductContext";
import { registerUser, loginUser } from "../../Services/UserServices";
import { getCart } from "../../Services/CartServices";
import { toast } from "react-toastify";
import { baseUrl } from "../../config/config";

const UserLoginPage = () => {
  const { HandleLogin, isAuthenticated, cartItems, setCartItems, user, setUser } = useContext(ProductContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    confirmPassword: "",
    rememberMe: false,
    Image: null,
  });

  // Redirect if already logged in based on role - moved to useEffect
  useEffect(() => {
    // Only redirect if we have both authentication state AND a valid token
    const token = localStorage.getItem('token');

    if (isAuthenticated && user && token) {
      // Use replace to prevent back button issues
      if (returnUrl) {
        navigate(returnUrl, { replace: true });
      } else if (user.role === "ADMIN") {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, returnUrl]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(inputs.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isReset) {
      if (!inputs.password) {
        newErrors.password = "Password is required";
      } else if (inputs.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (!isLogin && !validatePassword(inputs.password)) {
        newErrors.password = "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
      }
    }

    if (!isLogin && !isReset) {
      if (!inputs.firstname.trim()) {
        newErrors.firstname = "First name is required";
      }
      if (!inputs.lastname.trim()) {
        newErrors.lastname = "Last name is required";
      }
      if (!inputs.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(inputs.phone)) {
        newErrors.phone = "Invalid phone number";
      }
      if (!inputs.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!inputs.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (inputs.password !== inputs.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetInputs = () => {
    setInputs({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: "",
      address: "",
      confirmPassword: "",
      rememberMe: false,
      Image: null,
    });
    setErrors({});
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (!isLogin && !isReset) {
        // Register logic
        const formData = new FormData();
        formData.append("email", inputs.email);
        formData.append("password", inputs.password);
        formData.append("confirmpassword", inputs.confirmPassword);
        formData.append("firstname", inputs.firstname);
        formData.append("lastname", inputs.lastname);
        formData.append("phone", inputs.phone);
        formData.append("address", inputs.address);

        // Only append image if user selected one
        if (inputs.Image) {
          formData.append("image", inputs.Image);
        }

        // Debug: Log what we're sending
        console.log("Registration Data:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const res = await registerUser(formData);

        console.log("Registration Response:", res);

        if (res.ok) {
          toast.success(res?.data?.message || "Registration successful! Please check your email for verification.");

          // Store token and user data
          const userData = res.data?.data;
          const token = res.data?.token;

          if (userData) {
            if (token) {
              localStorage.setItem("token", token);
            }
            setUser && setUser(userData);
            HandleLogin(userData);

            // Redirect to returnUrl if provided, otherwise to dashboard
            if (returnUrl) {
              navigate(returnUrl);
            } else {
              navigate('/dashboard');
            }
          } else {
            setIsLogin(true);
            resetInputs();
          }
        } else {
          // Show detailed error message from backend
          const errorMessage = res?.data?.message || res?.data?.error || res.error || "Registration failed. Please try again.";
          console.error("Registration Error:", res?.data);
          toast.error(errorMessage);
        }
      } else if (isLogin && !isReset) {
        // Login Logic
        const userData = {
          email: inputs.email,
          password: inputs.password,
        };

        const res = await loginUser(userData, cartItems || []);
        if (res.ok) {
          toast.success(res?.data?.message || "Login successful!");

          // Token and cart cleanup is handled by loginUser service
          const loggedInUser = res.data?.data;
          const token = res.token;

          // Update context state
          setUser && setUser(loggedInUser);
          HandleLogin(loggedInUser);

          // Fetch cart from backend after successful login
          try {
            const cartResponse = await getCart(loggedInUser.id, token);
            if (cartResponse.ok && cartResponse.data?.data?.productCarts) {
              // Transform backend cart data to match frontend format
              const backendCart = cartResponse.data.data.productCarts.map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                description: item.product.description,
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor,
                category: item.product.category,
                rating: item.product.rating,
                discountPrice: item.product.discountPrice,
              }));
              setCartItems && setCartItems(backendCart);
            } else {
              // If no cart exists or error, just set empty cart
              setCartItems && setCartItems([]);
            }
          } catch (cartError) {
            console.error('Failed to fetch cart after login:', cartError);
            // Continue with login even if cart fetch fails
            setCartItems && setCartItems([]);
          }

          // Redirect to returnUrl if provided, otherwise role-based redirect
          if (returnUrl) {
            navigate(returnUrl);
          } else if (loggedInUser?.role === "ADMIN") {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          toast.error(res?.data?.message || res.error || "Login failed");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };






  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${baseUrl}auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inputs.email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || `Password reset link has been sent to ${inputs.email}`);
        resetInputs();
        setIsReset(false);
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          {!isReset && (
            <div className="flex">
              <button
                onClick={() => {
                  setIsLogin(true);
                  resetInputs();
                }}
                className={`w-1/2 py-4 font-semibold transition-all ${
                  isLogin
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  resetInputs();
                }}
                className={`w-1/2 py-4 font-semibold transition-all ${
                  !isLogin
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* LOGIN FORM */}
          {isLogin && !isReset && (
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <LogIn size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
                Welcome Back
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Sign in to your account
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={inputs.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                      errors.email
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={inputs.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`w-full p-3 pr-10 rounded-lg border-2 outline-none transition-all ${
                        errors.password
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={inputs.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsReset(true)}
                    className="text-black font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={20} className="animate-spin" />}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </div>
          )}

          {/* SIGNUP FORM - Similar structure, add remaining forms... */}
          {/* Add the signup and reset password forms from the  */}

           {/* SIGNUP FORM */}
        {!isLogin && !isReset && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-black text-white p-4 rounded-full">
                <User size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
              Create Account
            </h2>
            <p className="text-center text-gray-600 mb-6">Join us today</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={inputs.firstname}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                    errors.firstname
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors.firstname && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={inputs.lastname}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                    errors.lastname
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={inputs.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                    errors.phone
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                    errors.email
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={inputs.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                    errors.address
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Profile Image (Optional)
                </label>
                <input
                  type="file"
                  name="Image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full p-3 rounded-lg border-2 border-gray-300 outline-none transition-all focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                />
                {inputs.Image && (
                  <p className="text-green-600 text-xs mt-1">Selected: {inputs.Image.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={inputs.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                      errors.password
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">At least 8 characters with uppercase, lowercase, number, and special character</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={inputs.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 size={20} className="animate-spin" />}
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        {/* RESET PASSWORD FORM */}
        {isReset && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-black text-white p-4 rounded-full">
                <Settings size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
              Reset Password
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Enter your email to receive a reset link
            </p>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                    errors.email
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 size={20} className="animate-spin" />}
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsReset(false);
                  resetInputs();
                }}
                className="text-center text-sm text-gray-600 hover:text-black hover:underline"
              >
                Back to Login
              </button>
            </form>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
};

export default UserLoginPage;

