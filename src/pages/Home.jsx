import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/App';
import { Trophy, Coins, TrendingUp } from 'lucide-react';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axiosInstance.get('/game/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
    }
  };

  return (
    <div className="page-container">
      <div className="home-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 data-testid="home-title" className="float-animation">Toss & Earn</h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.7)' }}>Play, Win, Withdraw!</p>
      </div>

      {/* Balance Card */}
      <div className="card card-gold glow-animation" data-testid="balance-card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px' }}>Your Balance</div>
        <div style={{ fontSize: '3rem', fontWeight: '800', color: '#ffd700', fontFamily: 'Exo 2' }} data-testid="user-balance">
          ₹{user.balance.toFixed(2)}
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" data-testid="play-now-btn" onClick={() => navigate('/game')}>
            Play Now
          </button>
          <button className="btn btn-secondary" data-testid="add-funds-btn" onClick={() => navigate('/fund')}>
            Add Funds
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }} data-testid="total-games-card">
          <Trophy size={32} color="#ffd700" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffd700' }}>{user.total_games || 0}</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Games Played</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }} data-testid="total-won-card">
          <TrendingUp size={32} color="#2ecc71" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2ecc71' }}>{user.total_won || 0}</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Games Won</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }} data-testid="total-lost-card">
          <Coins size={32} color="#ff6348" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff6348' }}>{user.total_lost || 0}</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Games Lost</div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card" data-testid="leaderboard-section">
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Top Players</h2>
        {leaderboard.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leaderboard.map((player, index) => (
              <div
                key={index}
                data-testid={`leaderboard-player-${index}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: index === 0 ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: index < 3 ? '#0a0e27' : '#fff'
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>{player.username}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {player.total_games || 0} games
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#ffd700' }}>₹{player.balance.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>No players yet</p>
        )}
      </div>
    </div>
  );
};

export default Home;
