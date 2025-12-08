// DoctorSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  UserCircle, 
  Mail, 
  Lock, 
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Stethoscope,
  Phone,
  Award,
  FileText,
  Building,
  Users,
  CheckCircle
} from 'lucide-react';

const DoctorSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const specializations = [
        'Cardiology',
        'Neurology',
        'Pediatrics',
        'Orthopedics',
        'Dermatology',
        'Psychiatry',
        'General Medicine',
        'Surgery',
        'Gynecology',
        'Ophthalmology',
        'ENT',
        'Urology',
        'Oncology',
        'Endocrinology',
        'Gastroenterology',
        'Nephrology',
        'Rheumatology',
        'Hematology',
        'Pulmonology',
        'Anesthesiology'
    ];

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
            const response = await axios.post('http://localhost:8000/doctor/register', formData);

            toast.success(response.data.message);
            
            // Store token and doctor data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.doctor));
            
            // Redirect to doctor dashboard
            setTimeout(() => {
                navigate('/doctor/dashboard');
            }, 2000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            console.error('Registration error:', error.response?.data);
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
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-full opacity-20"></div>
                </div>

                {/* Logo/Header */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-3 rounded-2xl shadow-lg">
                            <Stethoscope className="h-8 w-8 text-teal-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">CareConnect</h1>
                    </div>
                    <p className="text-teal-100 mt-4 text-lg">Healthcare Professionals Network</p>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Join Our Network of<br />Medical Experts
                    </h2>
                    <p className="text-teal-100 text-lg mb-8">
                        Connect with patients, manage your practice, and grow your medical career 
                        with our comprehensive healthcare platform designed for professionals.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-teal-500/30 p-3 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Large Patient Base</h4>
                                <p className="text-teal-100 text-sm">Access thousands of potential patients</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="bg-teal-500/30 p-3 rounded-xl">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">Verified Platform</h4>
                                <p className="text-teal-100 text-sm">All medical credentials are verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-teal-500/30">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">500+</div>
                        <div className="text-teal-200 text-sm">Doctors Network</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">50K+</div>
                        <div className="text-teal-200 text-sm">Monthly Appointments</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">4.9★</div>
                        <div className="text-teal-200 text-sm">Average Rating</div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form Section */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-lg">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="bg-teal-600 p-3 rounded-2xl">
                                <Stethoscope className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">CareConnect</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Registration</h2>
                        <p className="text-gray-600">Join our professional healthcare network</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl mb-4">
                                <UserCircle className="h-8 w-8 text-teal-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Doctor Registration</h3>
                            <p className="text-gray-600 mt-2">Create your professional account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name (Dr.)
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
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50"
                                        placeholder="Dr. John Smith"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Professional Email
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
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50"
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
                                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50"
                                        placeholder="••••••••"
                                        minLength="6"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Medical Specialization
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 appearance-none"
                                        required
                                    >
                                        <option value="">Select Your Specialization</option>
                                        {specializations.map((spec) => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Note */}
                            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-teal-800">
                                            After registration, you can add additional professional information 
                                            including medical license number, experience, fees, and availability 
                                            in your doctor dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-700">
                                        I agree to the{' '}
                                        <a href="#" className="text-teal-600 hover:text-teal-800 font-medium">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-teal-600 hover:text-teal-800 font-medium">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
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
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Register as Doctor
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
                                    <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <Link
                                    to="/login/doctor"
                                    className="inline-flex items-center text-teal-600 hover:text-teal-800 font-semibold transition group"
                                >
                                    Sign in to Doctor Portal
                                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Patient Signup Link */}
                            <div className="text-center mt-8 pt-6 border-t border-gray-200">
                                <p className="text-gray-600">
                                    Looking for patient registration?{' '}
                                    <Link
                                        to="/signup/patient"
                                        className="text-blue-600 hover:text-blue-800 font-semibold transition hover:underline"
                                    >
                                        Register as Patient
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                All medical credentials are subject to verification. 
                                Contact{' '}
                                <a href="mailto:verification@medicarepro.com" className="text-teal-600 hover:underline">
                                    verification@medicarepro.com
                                </a>{' '}
                                for verification status.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorSignup;