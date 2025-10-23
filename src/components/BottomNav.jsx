import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Users, Wallet, Settings } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', testId: 'nav-home' },
    { path: '/game', icon: Gamepad2, label: 'Game', testId: 'nav-game' },
    { path: '/refer', icon: Users, label: 'Refer', testId: 'nav-refer' },
    { path: '/fund', icon: Wallet, label: 'Fund', testId: 'nav-fund' },
    { path: '/settings', icon: Settings, label: 'Settings', testId: 'nav-settings' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(10, 14, 39, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 215, 0, 0.2)',
        padding: '10px 0',
        zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
      }}
      data-testid="bottom-nav"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 12px',
                transition: 'all 0.3s ease',
                color: isActive ? '#ffd700' : 'rgba(255, 255, 255, 0.6)',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}
              data-testid={item.testId}
            >
              <Icon size={24} />
              <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : '400' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
