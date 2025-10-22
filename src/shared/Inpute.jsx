import React, { useState } from "react";
import { Eye, EyeOff, Search, Mail, Lock, User, Phone } from "lucide-react";

export const CustomInput = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  variant = "default",
  size = "md",
  icon,
  iconPosition = "left",
//   helperText,
  className = "",
  maxLength,
  name,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Icon mapping
  const iconMap = {
    search: Search,
    mail: Mail,
    lock: Lock,
    user: User,
    phone: Phone,
  };

  const IconComponent = icon ? iconMap[icon] : null;

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    default:
      "border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
    outlined:
      "border-2 border-gray-400 rounded-lg bg-transparent focus:border-blue-600",
    filled: "border-0 rounded-lg bg-gray-100 focus:bg-gray-200",
    underlined:
      "border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500",
  };

  // Error classes
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
    : "";

  // Disabled classes
  const disabledClasses = disabled
    ? "bg-gray-100 cursor-not-allowed opacity-60"
    : "";

  // Icon size based on input size
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative flex items-center">
        {/* Left Icon */}
        {IconComponent && iconPosition === "left" && (
          <div className="absolute left-3 text-gray-400">
            <IconComponent size={iconSize} />
          </div>
        )}

        {/* Input Field */}
        <input
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${errorClasses}
            ${disabledClasses}
            ${IconComponent && iconPosition === "left" ? "pl-10" : ""}
            ${IconComponent && iconPosition === "right" ? "pr-10" : ""}
            ${type === "password" ? "pr-10" : ""}
            outline-none
            transition-all
            duration-200
            ${isFocused ? "shadow-sm" : ""}
          `}
          {...rest}
        />

        {/* Right Icon */}
        {IconComponent &&
          iconPosition === "right" &&
          !type.includes("password") && (
            <div className="absolute right-3 text-gray-400">
              <IconComponent size={iconSize} />
            </div>
          )}

        {/* Password Toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={iconSize} />
            ) : (
              <Eye size={iconSize} />
            )}
          </button>
        )}
      </div>

      
    </div>
  );
};

