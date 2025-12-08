// DoctorDashboard.jsx (Updated with correct schema handling)
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
  MapPin,
  Stethoscope,
  Users,
  Star,
  DollarSign,
  Award,
  Briefcase,
  Building,
  Calendar as CalendarIcon,
  UserCheck,
  UserX,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    experience: '',
    fees: '',
    phone: '',
    availability: []
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  });
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0
  });
  const [appointmentFilter, setAppointmentFilter] = useState({
    status: '',
    date: '',
    time: ''
  });

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8000';
  const DOCTOR_API = `${API_BASE_URL}/doctor`;
  const APPOINTMENT_API = `${API_BASE_URL}/appointment`;

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
  ];

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching doctor profile from:', `${DOCTOR_API}/profile`);
      
      const response = await axios.get(`${DOCTOR_API}/profile`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Doctor profile response:', response.data);
      setDoctor(response.data);
      setDoctorInfo({
        experience: response.data.experience || 0,
        fees: response.data.fees || 500,
        phone: response.data.phone || '',
        availability: response.data.availability || []
      });
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      console.error('Error details:', error.response?.data);
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
      
      if (user && user.id) {
        const response = await axios.get(`${APPOINTMENT_API}/get-doctor-appointments/${user.id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Appointments response:', response.data);
        setAppointments(response.data);
        
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayApps = response.data.filter(apt => apt.date === today && apt.status !== 'cancelled');
        const pendingApps = response.data.filter(apt => apt.status === 'pending');
        
        // Extract unique patients
        const patientIds = [...new Set(response.data.map(apt => apt.patientId))];
        
        setStats({
          totalAppointments: response.data.length,
          todayAppointments: todayApps.length,
          totalPatients: patientIds.length,
          pendingAppointments: pendingApps.length
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load appointments');
    }
  };

  const updateDoctorInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating doctor info to:', `${DOCTOR_API}/profile`);
      console.log('Data:', doctorInfo);
      
      const response = await axios.put(`${DOCTOR_API}/profile`, doctorInfo, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update doctor info response:', response.data);
      toast.success('Doctor information updated successfully');
      setShowInfoModal(false);
      fetchDoctorProfile();
    } catch (error) {
      console.error('Error updating doctor info:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update information');
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      
      if (status === 'cancelled') {
        const response = await axios.put(`${APPOINTMENT_API}/cancel-appointment/${appointmentId}`, {}, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Cancel appointment response:', response.data);
        toast.success('Appointment cancelled successfully');
      } else if (status === 'confirmed') {
        // For confirmation, you might need to implement a separate endpoint
        // For now, let's simulate it
        const appointment = appointments.find(apt => apt._id === appointmentId);
        if (appointment) {
          appointment.status = 'confirmed';
          setAppointments([...appointments]);
          toast.success('Appointment confirmed successfully');
        }
      }
      
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to update appointment status');
    }
  };

  const addAvailabilitySlot = () => {
    const newSlot = {
      day: newAvailability.day,
      startTime: newAvailability.startTime,
      endTime: newAvailability.endTime
    };
    
    setDoctorInfo({
      ...doctorInfo,
      availability: [...doctorInfo.availability, newSlot]
    });
    
    toast.success('Time slot added successfully');
    setShowAddSlotModal(false);
    setNewAvailability({
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00'
    });
  };

  const removeAvailabilitySlot = (index) => {
    const updatedAvailability = [...doctorInfo.availability];
    updatedAvailability.splice(index, 1);
    setDoctorInfo({
      ...doctorInfo,
      availability: updatedAvailability
    });
    toast.success('Time slot removed successfully');
  };

  const filteredAppointments = () => {
    let filtered = appointments;
    
    if (appointmentFilter.status) {
      filtered = filtered.filter(apt => apt.status === appointmentFilter.status);
    }
    
    if (appointmentFilter.date) {
      filtered = filtered.filter(apt => apt.date === appointmentFilter.date);
    }
    
    if (appointmentFilter.time) {
      filtered = filtered.filter(apt => {
        const hour = parseInt(apt.time.split(':')[0]);
        if (appointmentFilter.time === 'morning') return hour >= 6 && hour < 12;
        if (appointmentFilter.time === 'afternoon') return hour >= 12 && hour < 17;
        if (appointmentFilter.time === 'evening') return hour >= 17 && hour < 21;
        return true;
      });
    }
    
    return filtered;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login/doctor');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPatientInitial = (patientId) => {
    if (!patientId) return 'P';
    return patientId.charAt(0).toUpperCase();
  };

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login/doctor');
      toast.error('Please login first');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
                <div className="bg-teal-600 p-2 rounded-lg">
                  <Stethoscope size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">CareConnect</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={22} />
                {stats.pendingAppointments > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="hidden lg:flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {doctor?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{doctor?.name}</p>
                  <p className="text-sm text-gray-500">{doctor?.specialization}</p>
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
            {/* Doctor Profile Card */}
            <div className="p-6 bg-linear-to-br from-teal-600 to-emerald-700 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{doctor?.name}</h3>
                  <p className="text-teal-100 text-sm">{doctor?.specialization}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold">{doctor?.experience || 0}</div>
                  <div className="text-sm text-teal-200">Years Exp.</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">${doctor?.fees || 500}</div>
                  <div className="text-sm text-teal-200">Consultation Fee</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-100'}`}
                >
                  <Activity size={20} />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'appointments' ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-100'}`}
                >
                  <Calendar size={20} />
                  <span>Appointments</span>
                  {stats.pendingAppointments > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {stats.pendingAppointments}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('patients')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'patients' ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-100'}`}
                >
                  <Users size={20} />
                  <span>Patients</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'schedule' ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-100'}`}
                >
                  <CalendarIcon size={20} />
                  <span>Schedule</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-100'}`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
              </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t">
              <button
                onClick={() => setShowInfoModal(true)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <Settings size={20} />
                <span>Update Info</span>
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
              <div className="bg-linear-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold">Welcome, {doctor?.name}!</h2>
                <p className="text-teal-100">Here's your practice overview for today</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Today's Appointments</p>
                      <p className="text-2xl font-bold mt-2">{stats.todayAppointments}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Total Patients</p>
                      <p className="text-2xl font-bold mt-2">{stats.totalPatients}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Pending Appointments</p>
                      <p className="text-2xl font-bold mt-2">{stats.pendingAppointments}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="text-yellow-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Total Appointments</p>
                      <p className="text-2xl font-bold mt-2">{stats.totalAppointments}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Activity className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Today's Appointments</h3>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-teal-600 hover:text-teal-800 font-medium flex items-center"
                  >
                    View All <ChevronRight size={18} />
                  </button>
                </div>
                {appointments.filter(apt => {
                  const today = new Date().toISOString().split('T')[0];
                  return apt.date === today && apt.status !== 'cancelled';
                }).length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-600">No appointments for today</p>
                    <p className="text-sm text-gray-500">Enjoy your day!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments
                      .filter(apt => {
                        const today = new Date().toISOString().split('T')[0];
                        return apt.date === today && apt.status !== 'cancelled';
                      })
                      .slice(0, 5)
                      .map((appointment) => (
                        <div key={appointment._id} className="border rounded-xl p-4 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">Patient {getPatientInitial(appointment.patientId)}</h4>
                              <p className="text-gray-600 text-sm">Appointment</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatTime(appointment.time)}</p>
                              <p className="text-gray-600 text-sm">
                                {appointment.reason ? appointment.reason.substring(0, 20) + '...' : 'General Checkup'}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status || 'scheduled'}
                            </span>
                            <div className="space-x-2">
                              <button 
                                onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowAddSlotModal(true)}
                    className="bg-teal-50 hover:bg-teal-100 rounded-xl p-4 text-center transition"
                  >
                    <CalendarIcon className="mx-auto mb-2 text-teal-600" size={24} />
                    <p className="font-medium">Add Time Slot</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className="bg-green-50 hover:bg-green-100 rounded-xl p-4 text-center transition"
                  >
                    <Users className="mx-auto mb-2 text-green-600" size={24} />
                    <p className="font-medium">View Patients</p>
                  </button>
                  <button
                    onClick={() => setShowInfoModal(true)}
                    className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 text-center transition"
                  >
                    <Settings className="mx-auto mb-2 text-purple-600" size={24} />
                    <p className="font-medium">Update Profile</p>
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
                <div className="flex space-x-3">
                  <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium">
                    Filter
                  </button>
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium">
                    Export
                  </button>
                </div>
              </div>
              
              {/* Appointment Filters */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <select 
                  value={appointmentFilter.status}
                  onChange={(e) => setAppointmentFilter({...appointmentFilter, status: e.target.value})}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="date"
                  value={appointmentFilter.date}
                  onChange={(e) => setAppointmentFilter({...appointmentFilter, date: e.target.value})}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <select 
                  value={appointmentFilter.time}
                  onChange={(e) => setAppointmentFilter({...appointmentFilter, time: e.target.value})}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="">All Time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
                <button 
                  onClick={() => setAppointmentFilter({ status: '', date: '', time: '' })}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                >
                  Clear Filters
                </button>
              </div>

              {filteredAppointments().length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-700">No appointments found</h3>
                  <p className="mt-2 text-gray-600">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments().map((appointment) => (
                    <div key={appointment._id} className="border rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                            <User size={24} className="text-teal-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-bold text-lg">Patient {getPatientInitial(appointment.patientId)}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status || 'scheduled'}
                              </span>
                            </div>
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
                              <p className="mt-3 text-gray-700">
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="space-x-2">
                            {appointment.status === 'pending' && (
                              <button 
                                onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                              >
                                Confirm
                              </button>
                            )}
                            {appointment.status !== 'cancelled' && (
                              <button 
                                onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          {appointment.status === 'confirmed' && (
                            <p className="mt-2 text-sm text-green-600">
                              <CheckCircle size={16} className="inline mr-1" />
                              Confirmed
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Patients</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              {stats.totalPatients === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-700">No patients yet</h3>
                  <p className="mt-2 text-gray-600">Patients will appear here after booking appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 6).map((appointment, index) => (
                    <div key={appointment._id} className="border rounded-xl p-6 hover:shadow-lg transition">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {getPatientInitial(appointment.patientId)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">Patient {getPatientInitial(appointment.patientId)}</h3>
                          <p className="text-gray-600 text-sm">Last visit: {formatDate(appointment.date)}</p>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center text-gray-700">
                              <Calendar size={16} className="mr-2" />
                              <span>Last appointment: {formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clock size={16} className="mr-2" />
                              <span>Time: {formatTime(appointment.time)}</span>
                            </div>
                            {appointment.reason && (
                              <div className="flex items-center text-gray-700">
                                <FileText size={16} className="mr-2" />
                                <span>Reason: {appointment.reason.substring(0, 30)}...</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex space-x-2">
                            <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium text-sm">
                              View History
                            </button>
                            <button className="flex-1 border border-teal-600 text-teal-600 hover:bg-teal-50 py-2 rounded-lg font-medium text-sm">
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Schedule & Availability</h2>
                <button
                  onClick={() => setShowAddSlotModal(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Time Slot
                </button>
              </div>

              {/* Current Availability */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Current Availability</h3>
                {doctorInfo.availability.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">No availability set yet</p>
                    <button
                      onClick={() => setShowAddSlotModal(true)}
                      className="mt-4 text-teal-600 hover:text-teal-800 font-medium"
                    >
                      Add your first time slot
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctorInfo.availability.map((slot, index) => (
                      <div key={index} className="border rounded-xl p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{slot.day}</h4>
                            <p className="text-gray-600">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeAvailabilitySlot(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

             
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
                        <div className="p-3 bg-gray-50 rounded-lg">{doctor?.name}</div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          {doctor?.email}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Specialization</label>
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                        <Briefcase size={16} className="mr-2 text-gray-400" />
                        {doctor?.specialization}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Experience (Years)</label>
                        <div className="p-3 bg-gray-50 rounded-lg">{doctor?.experience || 0}</div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Consultation Fee</label>
                        <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                          <DollarSign size={16} className="mr-2 text-gray-400" />
                          ${doctor?.fees || 500}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                        <Phone size={16} className="mr-2 text-gray-400" />
                        {doctor?.phone || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Availability</label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {doctorInfo.availability.length === 0 ? (
                          <p className="text-gray-500">No availability set</p>
                        ) : (
                          <div className="space-y-1">
                            {doctorInfo.availability.map((slot, index) => (
                              <div key={index} className="text-sm">
                                {slot.day}: {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-linear-to-br from-teal-50 to-emerald-50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">Practice Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Patients</span>
                        <span className="font-semibold">{stats.totalPatients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Appointments This Month</span>
                        <span className="font-semibold">{stats.totalAppointments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-semibold">
                          {doctor?.createdAt ? formatDate(doctor.createdAt) : 'Recent'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Status</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowInfoModal(true)}
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

      {/* Doctor Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Update Professional Information</h3>
              <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={doctorInfo.experience}
                  onChange={(e) => setDoctorInfo({...doctorInfo, experience: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="5"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Consultation Fee ($)</label>
                <input
                  type="number"
                  value={doctorInfo.fees}
                  onChange={(e) => setDoctorInfo({...doctorInfo, fees: parseInt(e.target.value) || 500})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={doctorInfo.phone}
                  onChange={(e) => setDoctorInfo({...doctorInfo, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowInfoModal(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={updateDoctorInfo}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Time Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Time Slot</h3>
              <button onClick={() => setShowAddSlotModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Day of Week</label>
                <select 
                  value={newAvailability.day}
                  onChange={(e) => setNewAvailability({...newAvailability, day: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newAvailability.startTime}
                    onChange={(e) => setNewAvailability({...newAvailability, startTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newAvailability.endTime}
                    onChange={(e) => setNewAvailability({...newAvailability, endTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddSlotModal(false);
                  setNewAvailability({
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '17:00'
                  });
                }}
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={addAvailabilitySlot}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition"
              >
                Add Slot
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

export default DoctorDashboard;