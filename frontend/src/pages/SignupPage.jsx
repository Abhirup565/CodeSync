import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from "axios";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errors, setErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: ''
  });

  // Simulate username availability check
  const checkUsernameAvailability = async (username) => {
    if (!username.trim() || username.length < 3) return;

    setUsernameStatus({ checking: true, available: null, message: '' });

    // Simulate API call
    try {
      const response = await axios.post("https://codesync-server-sing.onrender.com/auth/username-exists", { userName: username.toLowerCase() });
      const isTaken = response.data.isTaken;

      setUsernameStatus({
        checking: false,
        available: !isTaken,
        message: isTaken ? 'Username is already taken' : 'Username is available'
      })
    }
    catch (err) {
      console.log(err.response.data);
      setUsernameStatus({
        checking: false,
        available: null,
        message: ''
      })
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Check username availability
    if (name === 'username') {
      setUsernameStatus({ checking: false, available: null, message: '' });
      if (value.trim().length >= 3) {
        checkUsernameAvailability(value);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (usernameStatus.available === false) {
      newErrors.username = 'Please choose a different username';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    if (!validateForm()) return;

    setIsRegistering(true);
    // Make API call
    e.preventDefault();
    try {
      const response = await axios.post("https://codesync-server-sing.onrender.com/auth/sign-up", formData, { withCredentials: true });

      //delay slightly to allow cookie to be set
      await new Promise((res) => setTimeout(res, 100));
      setIsRegistering(false);

      const hasCookie = document.cookie.includes("uid");

      if (!hasCookie) {
        toast.error("Looks like your browser blocked cookies. Please enable them to stay logged in");
      } else {
        navigate('/');
        toast.success(response.data.message);
      }
    }
    catch (err) {
      toast.error(err.response.data.message);
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      {/* <Navbar/> */}

      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="text-center mb-8 mt-10">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Join CodeSync</h1>
          <p className="text-gray-300">
            Create your account to start collaborating
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="space-y-6 mx-auto">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.firstName
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400'
                  : 'border-gray-600 focus:border-blue-400 focus:ring-blue-400'
                  }`}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.lastName
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400'
                  : 'border-gray-600 focus:border-blue-400 focus:ring-blue-400'
                  }`}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Username with Availability Check */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a unique username"
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.username
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400'
                    : usernameStatus.available === true
                      ? 'border-green-500 focus:border-green-400 focus:ring-green-400'
                      : usernameStatus.available === false
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-400'
                        : 'border-gray-600 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                />
                {usernameStatus.checking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="h-5 w-5 text-blue-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Username Status Message */}
              {formData.username.length >= 3 && !usernameStatus.checking && usernameStatus.message && (
                <div className="flex items-center mt-1 space-x-1">
                  {usernameStatus.available ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <p className={`text-sm ${usernameStatus.available ? 'text-green-400' : 'text-red-400'}`}>
                    {usernameStatus.message}
                  </p>
                </div>
              )}

              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.password
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400'
                    : 'border-gray-600 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.confirmPassword
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400'
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-500 focus:border-green-400 focus:ring-green-400'
                      : 'border-gray-600 focus:border-blue-400 focus:ring-blue-400'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={isRegistering || usernameStatus.available === false}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isRegistering ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login"><button
              className="text-green-400 hover:text-green-300 transition-colors cursor-pointer"
            >
              Sign in here
            </button></Link>
          </p>
        </div>
      </div>
    </div>
  );
}