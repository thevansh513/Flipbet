import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/App';
import { toast } from 'sonner';
import { CreditCard, Wallet, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';

const Fund = ({ user, updateBalance }) => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transaction/history');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  const depositAmounts = [
    { amount: 1, link: 'https://rzp.io/rzp/cqDZoBZ' },
    { amount: 2, link: 'https://rzp.io/rzp/shSSqqA' },
    { amount: 5, link: 'https://rzp.io/rzp/AlJPYN3' },
    { amount: 10, link: 'https://rzp.io/rzp/qikDbHel' }
  ];

  const handleDeposit = (link, amount) => {
    // Open Razorpay link
    window.open(link, '_blank');
    toast.info('Complete payment and your balance will be updated automatically');
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 1) {
      toast.error('Minimum withdrawal amount is ₹1');
      return;
    }

    if (amount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (withdrawMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    if (withdrawMethod === 'bank' && (!accountNumber || !ifscCode)) {
      toast.error('Please enter bank details');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/transaction/withdraw', {
        amount,
        method: withdrawMethod,
        upi_id: upiId,
        account_number: accountNumber,
        ifsc_code: ifscCode
      });

      toast.success(response.data.message);
      setWithdrawAmount('');
      setUpiId('');
      setAccountNumber('');
      setIfscCode('');
      
      // Fetch updated profile to get new balance
      const profileResponse = await axiosInstance.get('/user/profile');
      updateBalance(profileResponse.data.balance);
      
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 data-testid="fund-title">Manage Funds</h1>

      {/* Balance Card */}
      <div className="card card-gold" style={{ textAlign: 'center', marginBottom: '30px' }} data-testid="fund-balance-card">
        <Wallet size={40} color="#ffd700" style={{ margin: '0 auto 10px' }} />
        <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Available Balance</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffd700', fontFamily: 'Exo 2' }} data-testid="fund-balance">
          ₹{user.balance.toFixed(2)}
        </div>
      </div>

      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          className={`btn ${activeTab === 'deposit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('deposit')}
          style={{ flex: 1 }}
          data-testid="deposit-tab-btn"
        >
          <ArrowDownCircle size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Deposit
        </button>
        <button
          className={`btn ${activeTab === 'withdraw' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('withdraw')}
          style={{ flex: 1 }}
          data-testid="withdraw-tab-btn"
        >
          <ArrowUpCircle size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Withdraw
        </button>
        <button
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
          style={{ flex: 1 }}
          data-testid="history-tab-btn"
        >
          <Clock size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          History
        </button>
      </div>

      {/* Deposit Section */}
      {activeTab === 'deposit' && (
        <div className="card" data-testid="deposit-section">
          <h2 style={{ marginBottom: '20px' }}>Add Funds</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
            Select an amount to deposit via Razorpay
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            {depositAmounts.map((item, index) => (
              <button
                key={index}
                className="btn btn-success"
                onClick={() => handleDeposit(item.link, item.amount)}
                style={{ padding: '20px', fontSize: '1.2rem', fontWeight: '700' }}
                data-testid={`deposit-${item.amount}-btn`}
              >
                <CreditCard size={24} style={{ marginBottom: '10px', display: 'block', margin: '0 auto 10px' }} />
                ₹{item.amount}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '12px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              Your balance will be updated automatically after successful payment
            </p>
          </div>
        </div>
      )}

      {/* Withdraw Section */}
      {activeTab === 'withdraw' && (
        <div className="card" data-testid="withdraw-section">
          <h2 style={{ marginBottom: '20px' }}>Withdraw Funds</h2>
          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              Withdrawals under ₹2 are processed automatically.
              Withdrawals ₹2 and above require admin approval.
            </p>
          </div>

          <form onSubmit={handleWithdraw}>
            <div style={{ marginBottom: '20px' }}>
              <label>Withdrawal Amount (Min ₹1)</label>
              <input
                type="number"
                className="input-field"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="1"
                step="0.01"
                required
                data-testid="withdraw-amount-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>Withdrawal Method</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className={`btn ${withdrawMethod === 'upi' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setWithdrawMethod('upi')}
                  style={{ flex: 1 }}
                  data-testid="upi-method-btn"
                >
                  UPI
                </button>
                <button
                  type="button"
                  className={`btn ${withdrawMethod === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setWithdrawMethod('bank')}
                  style={{ flex: 1 }}
                  data-testid="bank-method-btn"
                >
                  Bank Transfer
                </button>
              </div>
            </div>

            {withdrawMethod === 'upi' && (
              <div style={{ marginBottom: '20px' }}>
                <label>UPI ID</label>
                <input
                  type="text"
                  className="input-field"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  required
                  data-testid="upi-id-input"
                />
              </div>
            )}

            {withdrawMethod === 'bank' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label>Account Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="1234567890"
                    required
                    data-testid="account-number-input"
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    className="input-field"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="ABCD0123456"
                    required
                    data-testid="ifsc-code-input"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-danger"
              style={{ width: '100%' }}
              disabled={loading}
              data-testid="submit-withdraw-btn"
            >
              {loading ? 'Processing...' : 'Withdraw Now'}
            </button>
          </form>
        </div>
      )}

      {/* Transaction History */}
      {activeTab === 'history' && (
        <div className="card" data-testid="transaction-history">
          <h2 style={{ marginBottom: '20px' }}>Transaction History</h2>
          {transactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
              {transactions.map((txn, index) => (
                <div
                  key={index}
                  data-testid={`transaction-${index}`}
                  style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: txn.type === 'deposit' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 99, 72, 0.2)',
                        color: txn.type === 'deposit' ? '#2ecc71' : '#ff6348'
                      }}>
                        {txn.type === 'deposit' ? 'Deposit' : txn.type === 'withdrawal' ? 'Withdrawal' : 'Referral Bonus'}
                      </span>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: txn.type === 'deposit' || txn.type === 'referral_bonus' ? '#2ecc71' : '#ff6348' }}>
                      {txn.type === 'deposit' || txn.type === 'referral_bonus' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {new Date(txn.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <span style={{
                        fontSize: '0.85rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: txn.status === 'completed' ? 'rgba(46, 204, 113, 0.1)' : txn.status === 'pending' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 99, 72, 0.1)',
                        color: txn.status === 'completed' ? '#2ecc71' : txn.status === 'pending' ? '#ffd700' : '#ff6348'
                      }}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>No transactions yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Fund;
