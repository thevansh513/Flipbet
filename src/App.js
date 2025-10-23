import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Game from '@/pages/Game';
import Refer from '@/pages/Refer';
import Fund from '@/pages/Fund';
import Settings from '@/pages/Settings';
import AdminDashboard from '@/pages/AdminDashboard';
import BottomNav from '@/components/BottomNav';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: API,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      toast.error('Session expired, please login again');
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = (newBalance) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        {user ? (
          <>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/game" element={<Game user={user} updateBalance={updateBalance} />} />
              <Route path="/refer" element={<Refer user={user} />} />
              <Route path="/fund" element={<Fund user={user} updateBalance={updateBalance} />} />
              <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
              <Route path="/admin" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            {user.role !== 'admin' && <BottomNav />}
          </>
        ) : (
          <Routes>
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
