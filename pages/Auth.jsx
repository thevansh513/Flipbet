import React, { useState } from 'react';
import { axiosInstance } from '@/App';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { username, password }
        : { username, password, referral_code: referralCode };

      const response = await axiosInstance.post(endpoint, payload);
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingBottom: '20px' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }} data-testid="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ marginBottom: '10px' }} data-testid="auth-title">Toss & Earn</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Your Gaming Paradise</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button
            className={`btn ${isLogin ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsLogin(true)}
            style={{ flex: 1 }}
            data-testid="login-tab-btn"
          >
            <LogIn size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
            Login
          </button>
          <button
            className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsLogin(false)}
            style={{ flex: 1 }}
            data-testid="register-tab-btn"
          >
            <UserPlus size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              data-testid="username-input"
            />
          </div>

          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '38px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.5)'
              }}
              data-testid="toggle-password-btn"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label>Referral Code (Optional)</label>
              <input
                type="text"
                className="input-field"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                data-testid="referral-code-input"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
            data-testid="submit-auth-btn"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {!isLogin && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '12px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              Get ₹100 welcome bonus on signup!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
