// DoctorLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Mail, 
  Lock, 
  Stethoscope,
  ShieldCheck,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';

const DoctorLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/doctor/login', formData);

            toast.success(response.data.message);
            
            // Store token and doctor data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.doctor));
            
            // Redirect to doctor dashboard
            setTimeout(() => {
                navigate('/doctor/dashboard');
            }, 1500);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Left Panel - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-700 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
                </div>

                {/* Logo/Header */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-3 rounded-2xl shadow-lg">
                            <Stethoscope className="h-8 w-8 text-teal-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">CareConnect</h1>
                    </div>
                    <p className="text-teal-100 mt-4 text-lg">Doctor Portal</p>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Welcome Back<br />Doctor
                    </h2>
                    <p className="text-teal-100 text-lg mb-8">
                        Access your medical practice, manage appointments, and 
                        connect with your patients through our secure platform.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-teal-500/30 p-3 rounded-xl">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Secure Portal</h4>
                                <p className="text-teal-100 text-sm">HIPAA compliant patient data</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="bg-teal-500/30 p-3 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Patient Management</h4>
                                <p className="text-teal-100 text-sm">Comprehensive patient records</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-teal-500/30">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">24/7</div>
                        <div className="text-teal-200 text-sm">Access</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">100%</div>
                        <div className="text-teal-200 text-sm">Secure</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">500+</div>
                        <div className="text-teal-200 text-sm">Doctors</div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form Section */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="bg-teal-600 p-3 rounded-2xl">
                                <Stethoscope className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">CareConnect</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Login</h2>
                        <p className="text-gray-600">Access your professional portal</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl mb-4">
                                <Stethoscope className="h-8 w-8 text-teal-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Doctor Login</h3>
                            <p className="text-gray-600 mt-2">Sign in to your medical practice</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 hover:bg-gray-100"
                                        placeholder="doctor@hospital.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 hover:bg-gray-100"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                
                                {/* Forgot Password */}
                                <div className="flex justify-end mt-2">
                                    <Link
                                        to="/doctor/forgot-password"
                                        className="text-sm text-teal-600 hover:text-teal-800 font-medium transition"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                                    Remember me on this device
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In to Doctor Portal
                                        <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">New to CareConnect?</span>
                                </div>
                            </div>

                            {/* Registration Links */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Link
                                        to="/signup/doctor"
                                        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Register as Doctor
                                    </Link>
                                </div>
                                
                                <div className="text-center">
                                    <p className="text-gray-600">
                                        Are you a patient?{' '}
                                        <Link
                                            to="/login/patient"
                                            className="text-blue-600 hover:text-blue-800 font-semibold transition hover:underline"
                                        >
                                            Login to Patient Portal
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition">
                                    Terms of Service
                                </a>
                                <a href="mailto:support@medicarepro.com" className="text-sm text-gray-500 hover:text-teal-600 transition">
                                    Need Help?
                                </a>
                            </div>
                            
                            <p className="text-xs text-gray-500 text-center mt-4">
                                © {new Date().getFullYear()} CareConnect Doctor Portal. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;