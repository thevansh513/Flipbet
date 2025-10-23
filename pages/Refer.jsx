import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@/App';
import { toast } from 'sonner';
import { Users, Copy, Gift } from 'lucide-react';

const Refer = ({ user }) => {
  const [referrals, setReferrals] = useState([]);
  const [totalReferrals, setTotalReferrals] = useState(0);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await axiosInstance.get('/user/referrals');
      setReferrals(response.data.referrals);
      setTotalReferrals(response.data.total_referrals);
    } catch (error) {
      console.error('Failed to fetch referrals', error);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referral_code);
    toast.success('Referral code copied!');
  };

  const shareReferral = () => {
    const shareText = `Join Toss & Earn gaming app with my referral code: ${user.referral_code} and get ₹100 bonus! Play, win, and withdraw real money!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Toss & Earn',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Share message copied!');
    }
  };

  return (
    <div className="page-container">
      <h1 data-testid="refer-title">Refer & Earn</h1>

      {/* Referral Info Card */}
      <div className="card card-gold glow-animation" style={{ textAlign: 'center', marginBottom: '30px' }} data-testid="referral-info-card">
        <Gift size={48} color="#ffd700" style={{ margin: '0 auto 15px' }} />
        <h2 style={{ marginBottom: '10px' }}>Earn ₹100 Per Referral!</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
          Share your referral code and earn ₹100 when someone signs up using it!
        </p>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ffd700', fontFamily: 'Exo 2', marginBottom: '20px' }} data-testid="referral-code">
          {user.referral_code}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={copyReferralCode} data-testid="copy-code-btn">
            <Copy size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
            Copy Code
          </button>
          <button className="btn btn-secondary" onClick={shareReferral} data-testid="share-btn">
            Share
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }} data-testid="total-referrals-card">
          <Users size={32} color="#ffd700" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffd700' }}>{totalReferrals}</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Total Referrals</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }} data-testid="total-earned-card">
          <Gift size={32} color="#2ecc71" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2ecc71' }}>₹{totalReferrals * 100}</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Total Earned</div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="card" data-testid="referrals-list">
        <h3 style={{ marginBottom: '20px' }}>Your Referrals</h3>
        {referrals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {referrals.map((referral, index) => (
              <div
                key={index}
                data-testid={`referral-item-${index}`}
                style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>{referral.username}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Joined: {new Date(referral.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2ecc71' }}>+₹100</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>No referrals yet. Start sharing!</p>
        )}
      </div>

      {/* How it Works */}
      <div className="card" style={{ marginTop: '20px' }} data-testid="how-it-works">
        <h3 style={{ marginBottom: '15px' }}>How It Works</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ffd700', color: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>1</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '5px' }}>Share Your Code</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Copy and share your unique referral code with friends</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ffd700', color: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>2</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '5px' }}>Friend Signs Up</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Your friend creates an account using your code</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ffd700', color: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>3</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '5px' }}>Earn Reward</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Get ₹100 instantly added to your balance!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refer;
