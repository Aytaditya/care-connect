import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  User,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Heart,
  Activity,
  Pill,
  Clock,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Shield,
  Phone,
  Mail,
  Stethoscope,
  Users,
  Star,
  DollarSign
} from 'lucide-react';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState({
    bloodGroup: '',
    allergies: '',
    conditions: ''
  });
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    phone: ''
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const navigate = useNavigate();
  // CORRECTED: Direct endpoints without /api
  const API_BASE_URL = 'http://localhost:8000';
  const PATIENT_API = `${API_BASE_URL}/patient`;
  const APPOINTMENT_API = `${API_BASE_URL}/appointment`;
  const DOCTOR_API = `${API_BASE_URL}/doctor`;

  useEffect(() => {
    fetchPatientProfile();
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching profile from:', `${PATIENT_API}/profile`);
      console.log('Using token:', token);
      
      const response = await axios.get(`${PATIENT_API}/profile`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile response:', response.data);
      setPatient(response.data);
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        age: response.data.age || '',
        gender: response.data.gender || '',
        phone: response.data.phone || ''
      });
      if (response.data.medicalInfo) {
        setMedicalInfo(response.data.medicalInfo);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });
      toast.error(error.response?.data?.message || 'Failed to load profile data');
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      console.log('Fetching appointments from:', `${APPOINTMENT_API}/get-patient-appointments/${user?.id}`);
      
      if (user && user.id) {
        const response = await axios.get(`${APPOINTMENT_API}/get-patient-appointments/${user.id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Appointments response:', response.data);
        
        // Filter upcoming appointments (status !== 'cancelled' and date is in future)
        const now = new Date();
        const upcoming = response.data.filter(apt => {
          if (!apt.date) return false;
          const appointmentDate = new Date(apt.date);
          return apt.status !== 'cancelled' && appointmentDate >= now;
        });
        
        setUpcomingAppointments(upcoming);
        setMedicalHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors from:', `${DOCTOR_API}/profiles`);
      const response = await axios.get(`${DOCTOR_API}/profiles`);
      console.log('Doctors response:', response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load doctors list');
    }
  };

  const updateHealthInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating health info to:', `${PATIENT_API}/profile`);
      console.log('Data:', medicalInfo);
      
      const response = await axios.put(`${PATIENT_API}/profile`, medicalInfo, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update health info response:', response.data);
      toast.success('Health information updated successfully');
      setShowHealthModal(false);
      fetchPatientProfile();
    } catch (error) {
      console.error('Error updating health info:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update health information');
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating profile to:', `${PATIENT_API}/update-profile`);
      console.log('Data:', profileData);
      
      const response = await axios.put(`${PATIENT_API}/update-profile`, profileData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update profile response:', response.data);
      toast.success('Profile updated successfully');
      setShowProfileModal(false);
      fetchPatientProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const createAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      console.log('Creating appointment at:', `${APPOINTMENT_API}/create-appointment`);
      console.log('Data:', appointmentForm);
      
      if (!user || !user.id) {
        toast.error('User not found. Please login again.');
        return;
      }

      const appointmentData = {
        patientId: user.id,
        doctorId: appointmentForm.doctorId,
        date: appointmentForm.date,
        time: appointmentForm.time,
        reason: appointmentForm.reason
      };

      console.log('Appointment request data:', appointmentData);

      const response = await axios.post(`${APPOINTMENT_API}/create-appointment`, appointmentData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Create appointment response:', response.data);
      toast.success('Appointment created successfully!');
      setShowAppointmentModal(false);
      setAppointmentForm({
        doctorId: '',
        date: '',
        time: '',
        reason: ''
      });
      setSelectedDoctor(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create appointment');
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Cancelling appointment at:', `${APPOINTMENT_API}/cancel-appointment/${appointmentId}`);
      
      const response = await axios.put(`${APPOINTMENT_API}/cancel-appointment/${appointmentId}`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Cancel appointment response:', response.data);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login/patient');
    toast.info('Logged out successfully');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      if (isNaN(hour)) return timeString;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const getDoctorById = (doctorId) => {
    return doctors.find(doctor => doctor._id === doctorId) || { name: 'Unknown Doctor', specialization: 'General' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login/patient');
      toast.error('Please login first');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Stethoscope size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">CareConnect</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={22} />
                {upcomingAppointments.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="hidden lg:flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {patient?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{patient?.name || 'Patient'}</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:translate-x-0 lg:static lg:block`}>
          <div className="h-full flex flex-col">
            {/* User Profile Card */}
            <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{patient?.name || 'Patient'}</h3>
                  <p className="text-blue-100 text-sm">Patient ID: {patient?._id?.substring(0, 8) || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold">{patient?.age || 'N/A'}</div>
                  <div className="text-sm text-blue-200">Age</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{patient?.gender?.charAt(0).toUpperCase() + patient?.gender?.slice(1) || 'N/A'}</div>
                  <div className="text-sm text-blue-200">Gender</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Activity size={20} />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Calendar size={20} />
                  <span>Appointments</span>
                  {upcomingAppointments.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                      {upcomingAppointments.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('medical')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'medical' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <FileText size={20} />
                  <span>Medical Records</span>
                </button>

                <button
                  onClick={() => setActiveTab('health')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'health' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Heart size={20} />
                  <span>Health Info</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('doctors');
                    setShowDoctors(true);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Users size={20} />
                  <span>Find Doctors</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowDoctors(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
              </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t">
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition mt-2"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-6">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold">Welcome back, {patient?.name || 'Patient'}!</h2>
                <p className="text-blue-100">Here's your health overview for today</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Upcoming Appointments</p>
                      <p className="text-2xl font-bold mt-2">{upcomingAppointments.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Medical Records</p>
                      <p className="text-2xl font-bold mt-2">{medicalHistory.length}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Available Doctors</p>
                      <p className="text-2xl font-bold mt-2">{doctors.length}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Health Status</p>
                      <p className="text-2xl font-bold mt-2">
                        {medicalInfo.conditions ? 'Needs Review' : 'Good'}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Activity className="text-orange-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Upcoming Appointments</h3>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    View All <ChevronRight size={18} />
                  </button>
                </div>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-600">No upcoming appointments</p>
                    <button
                      onClick={() => setShowAppointmentModal(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Book Your First Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment) => {
                      const doctor = getDoctorById(appointment.doctorId);
                      return (
                        <div key={appointment._id} className="border rounded-xl p-4 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{doctor.name}</h4>
                              <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatDate(appointment.date)}</p>
                              <p className="text-gray-600 text-sm">{formatTime(appointment.time)}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status || 'scheduled'}
                            </span>
                            <div className="space-x-2">
                              <button 
                                onClick={() => {
                                  setActiveTab('appointments');
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Details
                              </button>
                              <button 
                                onClick={() => cancelAppointment(appointment._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 text-center transition"
                  >
                    <Calendar className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="font-medium">Book Appointment</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('medical')}
                    className="bg-green-50 hover:bg-green-100 rounded-xl p-4 text-center transition"
                  >
                    <FileText className="mx-auto mb-2 text-green-600" size={24} />
                    <p className="font-medium">View Records</p>
                  </button>
                  <button
                    onClick={() => setShowHealthModal(true)}
                    className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 text-center transition"
                  >
                    <Heart className="mx-auto mb-2 text-purple-600" size={24} />
                    <p className="font-medium">Update Health Info</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Appointments</h2>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  New Appointment
                </button>
              </div>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-700">No appointments yet</h3>
                  <p className="mt-2 text-gray-600">Book your first appointment to get started</p>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                  >
                    Book Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => {
                    const doctor = getDoctorById(appointment.doctorId);
                    return (
                      <div key={appointment._id} className="border rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Stethoscope className="text-blue-600" size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{doctor.name}</h3>
                              <p className="text-gray-600">{doctor.specialization}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="flex items-center text-gray-500">
                                  <Calendar size={16} className="mr-1" />
                                  {formatDate(appointment.date)}
                                </span>
                                <span className="flex items-center text-gray-500">
                                  <Clock size={16} className="mr-1" />
                                  {formatTime(appointment.time)}
                                </span>
                              </div>
                              {appointment.reason && (
                                <p className="mt-2 text-gray-700">
                                  <span className="font-medium">Reason:</span> {appointment.reason}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status || 'scheduled'}
                            </span>
                            <div className="mt-3 space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                Reschedule
                              </button>
                              <button 
                                onClick={() => cancelAppointment(appointment._id)}
                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'medical' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Medical History</h2>
              </div>
              {medicalHistory.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-700">No medical history yet</h3>
                  <p className="mt-2 text-gray-600">Your appointment history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalHistory.map((record) => {
                    const doctor = getDoctorById(record.doctorId);
                    return (
                      <div key={record._id} className="border rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                                {record.status || 'completed'}
                              </span>
                              <span className="text-gray-600">{formatDate(record.date)}</span>
                            </div>
                            <h3 className="font-bold text-lg">Appointment with {doctor.name}</h3>
                            <p className="text-gray-600">{doctor.specialization}</p>
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center text-gray-700">
                                <Clock size={16} className="mr-2" />
                                <span className="font-medium">Time:</span>
                                <span className="ml-2">{formatTime(record.time)}</span>
                              </div>
                              {record.reason && (
                                <div className="flex items-start text-gray-700">
                                  <span className="font-medium mr-2">Reason:</span>
                                  <span>{record.reason}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Health Info Tab */}
          {activeTab === 'health' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Health Information</h2>
                <button
                  onClick={() => setShowHealthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                >
                  <Edit size={20} className="mr-2" />
                  Update Information
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <Heart className="mr-2 text-red-500" size={20} />
                    Medical Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Blood Group</p>
                      <p className="font-semibold">{medicalInfo.bloodGroup || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Allergies</p>
                      <p className="font-semibold">{medicalInfo.allergies || 'None recorded'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Medical Conditions</p>
                      <p className="font-semibold">{medicalInfo.conditions || 'None recorded'}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <Shield className="mr-2 text-green-500" size={20} />
                    Personal Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Age</p>
                      <p className="font-semibold">{patient?.age || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Gender</p>
                      <p className="font-semibold">{patient?.gender?.charAt(0).toUpperCase() + patient?.gender?.slice(1) || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Contact Number</p>
                      <p className="font-semibold">{patient?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Find Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Find Doctors</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by specialization..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {doctors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-700">No doctors available</h3>
                  <p className="mt-2 text-gray-600">Please check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <div key={doctor._id} className="border rounded-xl p-6 hover:shadow-lg transition">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {doctor.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{doctor.name}</h3>
                          <p className="text-gray-600">{doctor.specialization}</p>
                          
                          <div className="mt-4 space-y-2">
                            {doctor.experience && (
                              <div className="flex items-center text-gray-700">
                                <Star size={16} className="mr-2 text-yellow-500" />
                                <span>{doctor.experience} years experience</span>
                              </div>
                            )}
                            {doctor.fees && (
                              <div className="flex items-center text-gray-700">
                                <DollarSign size={16} className="mr-2 text-green-500" />
                                <span>Fee: ${doctor.fees}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowAppointmentModal(true);
                            }}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <div className="p-3 bg-gray-50 rounded-lg">{patient?.name || 'Not available'}</div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          {patient?.email || 'Not available'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone</label>
                        <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                          <Phone size={16} className="mr-2 text-gray-400" />
                          {patient?.phone || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Age</label>
                        <div className="p-3 bg-gray-50 rounded-lg">{patient?.age || 'Not available'}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Gender</label>
                      <div className="p-3 bg-gray-50 rounded-lg">{patient?.gender?.charAt(0).toUpperCase() + patient?.gender?.slice(1) || 'Not available'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">Account Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Appointments</span>
                        <span className="font-semibold">{medicalHistory.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-semibold">
                          {patient?.createdAt ? formatDate(patient.createdAt) : 'Recent'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member Status</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="w-full mt-6 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Info Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Update Health Information</h3>
              <button onClick={() => setShowHealthModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Blood Group</label>
                <select
                  value={medicalInfo.bloodGroup}
                  onChange={(e) => setMedicalInfo({...medicalInfo, bloodGroup: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Allergies</label>
                <textarea
                  value={medicalInfo.allergies}
                  onChange={(e) => setMedicalInfo({...medicalInfo, allergies: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="List any allergies (separated by commas)"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Medical Conditions</label>
                <textarea
                  value={medicalInfo.conditions}
                  onChange={(e) => setMedicalInfo({...medicalInfo, conditions: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="List any medical conditions (separated by commas)"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowHealthModal(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={updateHealthInfo}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={updateProfile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Book Appointment</h3>
              <button onClick={() => {
                setShowAppointmentModal(false);
                setSelectedDoctor(null);
              }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            {selectedDoctor && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedDoctor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{selectedDoctor.name}</h4>
                    <p className="text-gray-600 text-sm">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                <input
                  type="hidden"
                  value={selectedDoctor._id}
                  onChange={(e) => setAppointmentForm({...appointmentForm, doctorId: selectedDoctor._id})}
                />
              </div>
            )}

            <div className="space-y-4">
              {!selectedDoctor && (
                <div>
                  <label className="block text-gray-700 mb-2">Select Doctor</label>
                  <select
                    value={appointmentForm.doctorId}
                    onChange={(e) => setAppointmentForm({...appointmentForm, doctorId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Reason for Appointment</label>
                <textarea
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Briefly describe your symptoms or reason for visit"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setAppointmentForm({ doctorId: '', date: '', time: '', reason: '' });
                  setSelectedDoctor(null);
                }}
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={createAppointment}
                disabled={!appointmentForm.doctorId || !appointmentForm.date || !appointmentForm.time}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;