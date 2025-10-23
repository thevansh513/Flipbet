import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';

const Settings = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <div className="page-container">
      <h1 data-testid="settings-title">Settings</h1>

      {/* Profile Card */}
      <div className="card card-gold" style={{ marginBottom: '20px' }} data-testid="profile-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '800',
            color: '#0a0e27'
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '5px' }} data-testid="username-display">{user.username}</h2>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Member since {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffd700' }}>₹{user.balance.toFixed(2)}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>Balance</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2ecc71' }}>{user.total_games || 0}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>Games</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3498db' }}>{user.total_won || 0}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>Wins</div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="card" style={{ marginBottom: '20px' }} data-testid="account-settings">
        <h3 style={{ marginBottom: '20px' }}>Account Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <User size={24} color="#ffd700" />
              <div>
                <div style={{ fontWeight: '600' }}>Username</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>{user.username}</div>
              </div>
            </div>
          </div>
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Shield size={24} color="#2ecc71" />
              <div>
                <div style={{ fontWeight: '600' }}>Account Status</div>
                <div style={{ fontSize: '0.85rem', color: '#2ecc71' }}>Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Access */}
      {user.role === 'admin' && (
        <div className="card" style={{ marginBottom: '20px' }} data-testid="admin-access">
          <h3 style={{ marginBottom: '15px' }}>Admin Access</h3>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/admin')}
            style={{ width: '100%' }}
            data-testid="admin-panel-btn"
          >
            <Shield size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
            Open Admin Panel
          </button>
        </div>
      )}

      {/* About */}
      <div className="card" style={{ marginBottom: '20px' }} data-testid="about-section">
        <h3 style={{ marginBottom: '15px' }}>About</h3>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
          <Info size={24} color="#3498db" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', margin: 0 }}>
              Toss & Earn is a gaming platform where you can play exciting games, win real money, and withdraw instantly.
              Refer friends to earn bonus rewards!
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        className="btn btn-danger"
        onClick={handleLogout}
        style={{ width: '100%' }}
        data-testid="logout-btn"
      >
        <LogOut size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
        Logout
      </button>
    </div>
  );
};

export default Settings;
