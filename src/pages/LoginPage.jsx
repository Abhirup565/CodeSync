import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
} from 'lucide-react';

// Login Page Component
export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [errors, setErrors] = useState({});

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    
    if (!validateForm()) return;
    
    setIsLogging(true);
    // Make API call
    e.preventDefault();

    try{
      const response = await axios.post("http://localhost:7500/auth/login", formData, {withCredentials: true});
      setIsLogging(false);
      alert(response.data.message);
      navigate("/");
    }catch(err){
        alert(err.response.data.message);
        setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      {/* <Navbar/> */}

      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8 mt-10">
          <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
          <p className="text-gray-300">
            Sign in to your CodeSync account
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
                  errors.username 
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400' 
                    : 'border-gray-600 focus:border-green-400 focus:ring-green-400'
                }`}
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
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
                  placeholder="Enter your password"
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-400 focus:ring-red-400' 
                      : 'border-gray-600 focus:border-green-400 focus:ring-green-400'
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
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLogging}
            className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isLogging ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register"><button className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
              Create one here
            </button></Link>
          </p>
        </div>
      </div>
    </div>
  );
}