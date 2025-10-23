import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/App';
import { toast } from 'sonner';
import { Users, Gamepad2, DollarSign, Settings as SettingsIcon, TrendingUp, X, Check, Ban, Coins } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const response = await axiosInstance.get('/admin/dashboard');
        setStats(response.data);
      } else if (activeTab === 'users') {
        const response = await axiosInstance.get('/admin/users');
        setUsers(response.data);
      } else if (activeTab === 'transactions') {
        const response = await axiosInstance.get('/admin/transactions?type=withdrawal&status=pending');
        setTransactions(response.data);
      } else if (activeTab === 'settings') {
        const response = await axiosInstance.get('/admin/settings');
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Failed to fetch data');
    }
  };

  const handleBanUser = async (username, isBanned) => {
    try {
      await axiosInstance.post(`/admin/users/${username}/ban`, { is_banned: !isBanned });
      toast.success(`User ${!isBanned ? 'banned' : 'unbanned'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleAdjustBalance = async () => {
    if (!selectedUser || !balanceAdjustment) return;

    const amount = parseFloat(balanceAdjustment);
    if (isNaN(amount)) {
      toast.error('Invalid amount');
      return;
    }

    try {
      await axiosInstance.post(`/admin/users/${selectedUser}/balance`, { amount });
      toast.success('Balance adjusted successfully');
      setSelectedUser(null);
      setBalanceAdjustment('');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to adjust balance');
    }
  };

  const handleApproveWithdrawal = async (transactionId) => {
    try {
      await axiosInstance.post(`/admin/transactions/${transactionId}/approve`);
      toast.success('Withdrawal approved');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve withdrawal');
    }
  };

  const handleRejectWithdrawal = async (transactionId) => {
    try {
      await axiosInstance.post(`/admin/transactions/${transactionId}/reject`);
      toast.success('Withdrawal rejected and balance refunded');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject withdrawal');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/admin/settings', settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 data-testid="admin-dashboard-title">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dashboard')}
          data-testid="dashboard-tab-btn"
        >
          <TrendingUp size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Dashboard
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
          data-testid="users-tab-btn"
        >
          <Users size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Users
        </button>
        <button
          className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('transactions')}
          data-testid="transactions-tab-btn"
        >
          <DollarSign size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Withdrawals
        </button>
        <button
          className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('settings')}
          data-testid="settings-tab-btn"
        >
          <SettingsIcon size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Settings
        </button>
      </div>

      {/* Dashboard Stats */}
      {activeTab === 'dashboard' && stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            <div className="card" style={{ textAlign: 'center' }} data-testid="total-users-stat">
              <Users size={32} color="#ffd700" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffd700' }}>{stats.total_users}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Total Users</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }} data-testid="total-games-stat">
              <Gamepad2 size={32} color="#3498db" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3498db' }}>{stats.total_games}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Total Games</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }} data-testid="total-deposits-stat">
              <TrendingUp size={32} color="#2ecc71" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2ecc71' }}>₹{stats.total_deposits}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Total Deposits</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }} data-testid="total-withdrawals-stat">
              <DollarSign size={32} color="#ff6348" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ff6348' }}>₹{stats.total_withdrawals}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Total Withdrawals</div>
            </div>
            <div className="card card-gold" style={{ textAlign: 'center' }} data-testid="pending-withdrawals-stat">
              <DollarSign size={32} color="#ffd700" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffd700' }}>{stats.pending_withdrawals}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Pending Withdrawals</div>
            </div>
          </div>
        </>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="card" data-testid="users-management">
          <h2 style={{ marginBottom: '20px' }}>Users Management</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Balance</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Games</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }} data-testid={`user-row-${index}`}>
                    <td style={{ padding: '12px' }}>{user.username}</td>
                    <td style={{ padding: '12px', color: '#ffd700', fontWeight: '600' }}>₹{user.balance.toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>{user.total_games || 0}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        background: user.is_banned ? 'rgba(255, 99, 72, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                        color: user.is_banned ? '#ff6348' : '#2ecc71'
                      }}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setSelectedUser(user.username);
                            setBalanceAdjustment('');
                          }}
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          data-testid={`adjust-balance-btn-${index}`}
                        >
                          <Coins size={16} />
                        </button>
                        <button
                          className={`btn ${user.is_banned ? 'btn-success' : 'btn-danger'}`}
                          onClick={() => handleBanUser(user.username, user.is_banned)}
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          data-testid={`ban-user-btn-${index}`}
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} data-testid="balance-adjustment-modal">
          <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
            <h3 style={{ marginBottom: '20px' }}>Adjust Balance for {selectedUser}</h3>
            <div style={{ marginBottom: '20px' }}>
              <label>Amount (+ to add, - to deduct)</label>
              <input
                type="number"
                className="input-field"
                value={balanceAdjustment}
                onChange={(e) => setBalanceAdjustment(e.target.value)}
                placeholder="e.g., 100 or -50"
                data-testid="balance-adjustment-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={handleAdjustBalance}
                style={{ flex: 1 }}
                data-testid="confirm-adjustment-btn"
              >
                Confirm
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedUser(null);
                  setBalanceAdjustment('');
                }}
                style={{ flex: 1 }}
                data-testid="cancel-adjustment-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Withdrawals */}
      {activeTab === 'transactions' && (
        <div className="card" data-testid="pending-withdrawals">
          <h2 style={{ marginBottom: '20px' }}>Pending Withdrawals</h2>
          {transactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {transactions.map((txn, index) => (
                <div
                  key={index}
                  data-testid={`withdrawal-${index}`}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 215, 0, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '5px' }}>{txn.username}</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {new Date(txn.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffd700' }}>₹{txn.amount.toFixed(2)}</div>
                  </div>
                  <div style={{ marginBottom: '15px', fontSize: '0.9rem' }}>
                    <div style={{ marginBottom: '5px' }}>
                      <strong>Method:</strong> {txn.method === 'upi' ? 'UPI' : 'Bank Transfer'}
                    </div>
                    {txn.method === 'upi' && txn.upi_id && (
                      <div style={{ marginBottom: '5px' }}>
                        <strong>UPI ID:</strong> {txn.upi_id}
                      </div>
                    )}
                    {txn.method === 'bank' && (
                      <>
                        {txn.account_number && (
                          <div style={{ marginBottom: '5px' }}>
                            <strong>Account:</strong> {txn.account_number}
                          </div>
                        )}
                        {txn.ifsc_code && (
                          <div style={{ marginBottom: '5px' }}>
                            <strong>IFSC:</strong> {txn.ifsc_code}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-success"
                      onClick={() => handleApproveWithdrawal(txn._id || Object.values(txn).find(v => typeof v === 'object' && v.$oid)?.$oid)}
                      style={{ flex: 1 }}
                      data-testid={`approve-withdrawal-btn-${index}`}
                    >
                      <Check size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRejectWithdrawal(txn._id || Object.values(txn).find(v => typeof v === 'object' && v.$oid)?.$oid)}
                      style={{ flex: 1 }}
                      data-testid={`reject-withdrawal-btn-${index}`}
                    >
                      <X size={18} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>No pending withdrawals</p>
          )}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && settings && (
        <div className="card" data-testid="admin-settings">
          <h2 style={{ marginBottom: '20px' }}>Game Settings</h2>
          <form onSubmit={handleUpdateSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label>Coin Toss Min Bet (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.coin_toss_min_bet}
                  onChange={(e) => setSettings({ ...settings, coin_toss_min_bet: Number(e.target.value) })}
                  min="1"
                  data-testid="coin-toss-min-bet-input"
                />
              </div>
              <div>
                <label>Coin Toss Max Bet (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.coin_toss_max_bet}
                  onChange={(e) => setSettings({ ...settings, coin_toss_max_bet: Number(e.target.value) })}
                  min="1"
                  data-testid="coin-toss-max-bet-input"
                />
              </div>
              <div>
                <label>Coin Toss Payout (x)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={settings.coin_toss_payout}
                  onChange={(e) => setSettings({ ...settings, coin_toss_payout: Number(e.target.value) })}
                  min="1"
                  data-testid="coin-toss-payout-input"
                />
              </div>
              <div>
                <label>Spin Wheel Cost (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.spin_wheel_cost}
                  onChange={(e) => setSettings({ ...settings, spin_wheel_cost: Number(e.target.value) })}
                  min="1"
                  data-testid="spin-wheel-cost-input"
                />
              </div>
              <div>
                <label>Referral Bonus (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.referral_bonus}
                  onChange={(e) => setSettings({ ...settings, referral_bonus: Number(e.target.value) })}
                  min="0"
                  data-testid="referral-bonus-input"
                />
              </div>
              <div>
                <label>Withdrawal Threshold (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.withdrawal_threshold}
                  onChange={(e) => setSettings({ ...settings, withdrawal_threshold: Number(e.target.value) })}
                  min="1"
                  data-testid="withdrawal-threshold-input"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px' }}
              disabled={loading}
              data-testid="save-settings-btn"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
