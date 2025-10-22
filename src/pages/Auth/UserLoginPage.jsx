

// import { useState } from "react";
// import Layout from "../../shared/Layout/Layout";
// import Input from "../../shared/ClassInput";



//   const EnhancedLoginPage = () => {
//   const { login } = useAuth();
//   const [isLogin, setIsLogin] = useState(true);
//   const [isReset, setIsReset] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [inputs, setInputs] = useState({
//     email: '',
//     password: '',
//     fullName: '',
//     phone: '',
//     confirmPassword: '',
//     rememberMe: false,
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setInputs((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePhone = (phone) => {
//     const phoneRegex = /^[0-9]{10,15}$/;
//     return phoneRegex.test(phone);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!inputs.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(inputs.email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     if (!isReset) {
//       if (!inputs.password) {
//         newErrors.password = 'Password is required';
//       } else if (inputs.password.length < 6) {
//         newErrors.password = 'Password must be at least 6 characters';
//       }
//     }

//     if (!isLogin && !isReset) {
//       if (!inputs.fullName.trim()) {
//         newErrors.fullName = 'Full name is required';
//       }
//       if (!inputs.phone.trim()) {
//         newErrors.phone = 'Phone number is required';
//       } else if (!validatePhone(inputs.phone)) {
//         newErrors.phone = 'Invalid phone number';
//       }
//       if (!inputs.confirmPassword) {
//         newErrors.confirmPassword = 'Please confirm your password';
//       } else if (inputs.password !== inputs.confirmPassword) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const resetInputs = () => {
//     setInputs({
//       email: '',
//       password: '',
//       fullName: '',
//       phone: '',
//       confirmPassword: '',
//       rememberMe: false,
//     });
//     setErrors({});
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     if (isLogin) {
//       // Simulate login
//       const userData = {
//         email: inputs.email,
//         fullName: 'John Doe',
//         phone: '1234567890',
//       };
//       login(userData);
//       alert('Login successful!');
//     } else {
//       // Simulate signup
//       const userData = {
//         email: inputs.email,
//         fullName: inputs.fullName,
//         phone: inputs.phone,
//       };
//       login(userData);
//       alert('Account created successfully!');
//     }
//     resetInputs();
//   };

//   const handleResetPassword = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     alert(`A password reset link has been sent to ${inputs.email}`);
//     resetInputs();
//     setIsReset(false);
//   };

//   return (
//     <Layout>
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
//       <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//         {!isReset && (
//           <div className="flex">
//             <button
//               onClick={() => {
//                 setIsLogin(true);
//                 resetInputs();
//               }}
//               className={`w-1/2 py-4 font-semibold transition-all ${
//                 isLogin
//                   ? 'bg-black text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => {
//                 setIsLogin(false);
//                 resetInputs();
//               }}
//               className={`w-1/2 py-4 font-semibold transition-all ${
//                 !isLogin
//                   ? 'bg-black text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>
//         )}

//         {/* LOGIN FORM */}
//         {isLogin && !isReset && (
//           <div className="p-8">
//             <div className="flex justify-center mb-6">
//               <div className="bg-black text-white p-4 rounded-full">
//                 <LogIn size={32} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
//               Welcome Back
//             </h2>
//             <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
            
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={inputs.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                   className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                     errors.email
//                       ? 'border-red-500 focus:border-red-600'
//                       : 'border-gray-300 focus:border-black'
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={inputs.password}
//                     onChange={handleInputChange}
//                     placeholder="Enter your password"
//                     className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                       errors.password
//                         ? 'border-red-500 focus:border-red-600'
//                         : 'border-gray-300 focus:border-black'
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                   >
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//                 )}
//               </div>

//               <div className="flex justify-between items-center text-sm">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="rememberMe"
//                     checked={inputs.rememberMe}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 accent-black"
//                   />
//                   <span className="text-gray-600">Remember me</span>
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setIsReset(true)}
//                   className="text-black font-medium hover:underline"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2"
//               >
//                 Sign In
//               </button>
//             </form>
//           </div>
//         )}

//         {/* SIGNUP FORM */}
//         {!isLogin && !isReset && (
//           <div className="p-8">
//             <div className="flex justify-center mb-6">
//               <div className="bg-black text-white p-4 rounded-full">
//                 <User size={32} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
//               Create Account
//             </h2>
//             <p className="text-center text-gray-600 mb-6">Join us today</p>

//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={inputs.fullName}
//                   onChange={handleInputChange}
//                   placeholder="Enter your full name"
//                   className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                     errors.fullName
//                       ? 'border-red-500 focus:border-red-600'
//                       : 'border-gray-300 focus:border-black'
//                   }`}
//                 />
//                 {errors.fullName && (
//                   <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={inputs.phone}
//                   onChange={handleInputChange}
//                   placeholder="Enter your phone number"
//                   className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                     errors.phone
//                       ? 'border-red-500 focus:border-red-600'
//                       : 'border-gray-300 focus:border-black'
//                   }`}
//                 />
//                 {errors.phone && (
//                   <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={inputs.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                   className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                     errors.email
//                       ? 'border-red-500 focus:border-red-600'
//                       : 'border-gray-300 focus:border-black'
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={inputs.password}
//                     onChange={handleInputChange}
//                     placeholder="Create a password"
//                     className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                       errors.password
//                         ? 'border-red-500 focus:border-red-600'
//                         : 'border-gray-300 focus:border-black'
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                   >
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     name="confirmPassword"
//                     value={inputs.confirmPassword}
//                     onChange={handleInputChange}
//                     placeholder="Confirm your password"
//                     className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                       errors.confirmPassword
//                         ? 'border-red-500 focus:border-red-600'
//                         : 'border-gray-300 focus:border-black'
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                   >
//                     {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2"
//               >
//                 Create Account
//               </button>
//             </form>
//           </div>
//         )}

//         {/* RESET PASSWORD FORM */}
//         {isReset && (
//           <div className="p-8">
//             <div className="flex justify-center mb-6">
//               <div className="bg-black text-white p-4 rounded-full">
//                 <Settings size={32} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
//               Reset Password
//             </h2>
//             <p className="text-center text-gray-600 mb-6">
//               Enter your email to receive a reset link
//             </p>

//             <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={inputs.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                   className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
//                     errors.email
//                       ? 'border-red-500 focus:border-red-600'
//                       : 'border-gray-300 focus:border-black'
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
//               >
//                 Send Reset Link
//               </button>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsReset(false);
//                   resetInputs();
//                 }}
//                 className="text-center text-sm text-gray-600 hover:text-black hover:underline"
//               >
//                 Back to Login
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//     </Layout>
//   );
// };

// export default EnhancedLoginPage;






// const UserLoginPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [isReset, setIsReset] = useState(false);
//   const [inputs, setInputs] = useState({
//     email: "",
//     password: "",
//     fullName: "",
//     phone: "",
//     confirmPassword: "",
//     rememberMe: false,
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setInputs((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const resetInputs = () => {
//     setInputs({
//       email: "",
//       password: "",
//       fullName: "",
//       phone: "",
//       confirmPassword: "",
//       rememberMe: false,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Submitted:", inputs);
//     resetInputs();
//   };

//   const handleResetPassword = (e) => {
//     e.preventDefault();
//     if (!inputs.email.trim()) {
//       alert("Please enter your email to reset password.");
//       return;
//     }
//     alert(`A password reset link has been sent to ${inputs.email}`);
//     resetInputs();
//     setIsReset(false);
//   };

//   return (
//     <Layout>
//       <div className="flex justify-center items-center min-h-screen bg-primary px-4">
//         <div className="relative bg-white w-full max-w-md rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
//           {!isReset && (
//             <div className="flex">
//               <button
//                 onClick={() => {
//                   setIsLogin(true);
//                   resetInputs();
//                 }}
//                 className={`w-1/2 py-3 font-semibold transition-all ${
//                   isLogin
//                     ? "bg-black text-white"
//                     : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => {
//                   setIsLogin(false);
//                   resetInputs();
//                 }}
//                 className={`w-1/2 py-3 font-semibold transition-all ${
//                   !isLogin
//                     ? "bg-black text-white"
//                     : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                 }`}
//               >
//                 Sign Up
//               </button>
//             </div>
//           )}

//           {/* LOGIN */}
//           {isLogin && !isReset && (
//             <div className="p-8">
//               <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
//                 Welcome Back
//               </h2>
//               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                 <Input
//                   type="email"
//                   labelFor="Email"
//                   name="email"
//                   value={inputs.email}
//                   onChange={handleInputChange}
//                   placehold="Enter your email"
//                 />
//                 <Input
//                   type="password"
//                   labelFor="Password"
//                   name="password"
//                   value={inputs.password}
//                   onChange={handleInputChange}
//                   placehold="Enter your password"
//                 />
//                 <div className="flex justify-between items-center text-sm text-gray-600">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="rememberMe"
//                       checked={inputs.rememberMe}
//                       onChange={handleInputChange}
//                       className="accent-black w-4 h-4"
//                     />
//                     Remember me
//                   </label>
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
//                 >
//                   Login
//                 </button>
//               </form>
//               <span
//                 onClick={() => setIsReset(true)}
//                 className="hover:underline cursor-pointer font-medium flex justify-center items-center mt-3"
//               >
//                 Forgot Password?
//               </span>
//             </div>
//           )}

//           {/* SIGNUP */}
//           {!isLogin && !isReset && (
//             <div className="p-8">
//               <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
//                 Create Account
//               </h2>
//               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                 <Input
//                   type="text"
//                   labelFor="Full Name"
//                   name="fullName"
//                   value={inputs.fullName}
//                   onChange={handleInputChange}
//                   placehold="Full Name"
//                 />
//                 <Input
//                   type="text"
//                   labelFor="Phone Number"
//                   name="phone"
//                   value={inputs.phone}
//                   onChange={handleInputChange}
//                   placehold="Phone Number"
//                 />
//                 <Input
//                   type="email"
//                   labelFor="Email"
//                   name="email"
//                   value={inputs.email}
//                   onChange={handleInputChange}
//                   placehold="Email"
//                 />
//                 <Input
//                   type="password"
//                   labelFor="Password"
//                   name="password"
//                   value={inputs.password}
//                   onChange={handleInputChange}
//                   placehold="Password"
//                 />
//                 <Input
//                   type="password"
//                   labelFor="Confirm Password"
//                   name="confirmPassword"
//                   value={inputs.confirmPassword}
//                   onChange={handleInputChange}
//                   placehold="Confirm Password"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
//                 >
//                   Sign Up
//                 </button>
//               </form>
//               <p className="text-center text-sm mt-6 text-gray-600">
//                 Already have an account?{" "}
//                 <span
//                   onClick={() => setIsLogin(true)}
//                   className="text-black font-semibold hover:underline cursor-pointer"
//                 >
//                   Login
//                 </span>
//               </p>
//             </div>
//           )}

//           {/* FORGOT PASSWORD */}
//           {isReset && (
//             <div className="p-8">
//               <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
//                 Reset Password
//               </h2>
//               <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
//                 <Input
//                   type="email"
//                   labelFor="Email"
//                   name="email"
//                   value={inputs.email}
//                   onChange={handleInputChange}
//                   placehold="Enter your email"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
//                 >
//                   Send Reset Link
//                 </button>
//                 <p
//                   onClick={() => setIsReset(false)}
//                   className="text-center text-sm text-gray-600 hover:underline cursor-pointer"
//                 >
//                   Back to Login
//                 </p>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UserLoginPage;







import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../shared/Layout/Layout";
import Input from "../../shared/ClassInput";
import { ProductContext } from "../../Context/ProductContext";
import { Eye, EyeOff, LogIn, User, Settings } from "lucide-react";

const UserLoginPage = () => {
  const { HandleLogin, isAuthenticated } = useContext(ProductContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    confirmPassword: "",
    rememberMe: false,
  });

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      }
    }

    if (!isLogin && !isReset) {
      if (!inputs.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!inputs.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(inputs.phone)) {
        newErrors.phone = "Invalid phone number";
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
      fullName: "",
      phone: "",
      confirmPassword: "",
      rememberMe: false,
    });
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isLogin) {
      const userData = {
        email: inputs.email,
        fullName: "John Doe",
        phone: "1234567890",
      };
      HandleLogin(userData);
      alert("Login successful!");
      navigate('/dashboard');
    } else {
      const userData = {
        email: inputs.email,
        fullName: inputs.fullName,
        phone: inputs.phone,
      };
      HandleLogin(userData);
      alert("Account created successfully!");
      navigate('/dashboard');
    }
    resetInputs();
  };

  const handleResetPassword = () => {
    if (!validateForm()) return;
    alert(`A password reset link has been sent to ${inputs.email}`);
    resetInputs();
    setIsReset(false);
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
                  className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* SIGNUP FORM - Similar structure, add remaining forms... */}
          {/* Add the signup and reset password forms from the artifact */}

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
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={inputs.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full p-3 rounded-lg border-2 outline-none transition-all ${
                    errors.fullName
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-black'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
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
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all mt-2"
              >
                Create Account
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
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
              >
                Send Reset Link
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

