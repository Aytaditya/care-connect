
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  UserCircle, 
  Mail, 
  Lock, 
  Phone, 
  Calendar,
  Users,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';

const PatientSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: '',
        phone: ''
    });
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
            const response = await axios.post('http://localhost:8000/patient/register', formData);

            toast.success(response.data.message);
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.patient));
            
            setTimeout(() => {
                navigate('/patient/dashboard');
            }, 2000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Left Panel - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
                </div>

                {/* Logo/Header */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-3 rounded-2xl shadow-lg">
                            <Stethoscope className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">CareConnect</h1>
                    </div>
                    <p className="text-blue-100 mt-4 text-lg">Patient Management System</p>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Your Health Journey<br />Starts Here
                    </h2>
                    <p className="text-blue-100 text-lg mb-8">
                        Join thousands of patients who manage their healthcare seamlessly. 
                        Book appointments, track medical records, and connect with top specialists.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500/30 p-3 rounded-xl">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Secure & Private</h4>
                                <p className="text-blue-100 text-sm">HIPAA compliant data protection</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500/30 p-3 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Expert Doctors</h4>
                                <p className="text-blue-100 text-sm">Access to certified specialists</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-blue-500/30">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">10K+</div>
                        <div className="text-blue-200 text-sm">Active Patients</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">500+</div>
                        <div className="text-blue-200 text-sm">Expert Doctors</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">99%</div>
                        <div className="text-blue-200 text-sm">Satisfaction Rate</div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form Section */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="bg-blue-600 p-3 rounded-2xl">
                                <Stethoscope className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">CareConnect</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Registration</h2>
                        <p className="text-gray-600">Create your healthcare account</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
                                <UserCircle className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Create Patient Account</h3>
                            <p className="text-gray-600 mt-2">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <UserCircle className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="relative">
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
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                        placeholder="••••••••"
                                        minLength="6"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Age & Gender */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Age
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                            placeholder="25"
                                            min="1"
                                            max="120"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                        placeholder="+1 234 567 8900"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Patient Account
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
                                    <span className="px-4 bg-white text-gray-500">Already registered?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <Link
                                    to="/login/patient"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition group"
                                >
                                    Sign in to your account
                                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Doctor Signup Link */}
                            <div className="text-center mt-8 pt-6 border-t border-gray-200">
                                <p className="text-gray-600">
                                    Are you a healthcare professional?{' '}
                                    <Link
                                        to="/signup/doctor"
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold transition hover:underline"
                                    >
                                        Register as Doctor
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                By registering, you agree to our{' '}
                                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                                and{' '}
                                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSignup;