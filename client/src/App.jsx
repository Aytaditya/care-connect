
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PatientSignup from './components/PatientSignup';
import PatientLogin from './components/PatientLogin';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorSignup from './components/DoctorSignup';
import DoctorLogin from './components/DoctorLogin';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/login/patient" />} />
                    <Route path="/signup/patient" element={<PatientSignup />} />
                    <Route path="/signup/doctor" element={<DoctorSignup />} />
                    <Route path="/login/patient" element={<PatientLogin />} />
                    <Route path="/login/doctor" element={<DoctorLogin />} />
                    {/* <Route path="/signup/doctor" element={<DoctorSignup />} /> */}
                    
                    {/* Protected Routes */}
                     <Route path="/patient/dashboard" element={
                        <ProtectedRoute>
                            <PatientDashboard />
                        </ProtectedRoute>
                    } /> 
                    <Route path="/doctor/dashboard" element={
                        <ProtectedRoute>
                            <DoctorDashboard />
                        </ProtectedRoute>
                    } />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/login/patient" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;