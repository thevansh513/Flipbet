import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/App';
import { toast } from 'sonner';
import { Coins, Trophy, History } from 'lucide-react';

const Game = ({ user, updateBalance }) => {
  const [activeGame, setActiveGame] = useState('toss');
  const [betAmount, setBetAmount] = useState(1);
  const [choice, setChoice] = useState('heads');
  const [isPlaying, setIsPlaying] = useState(false);
  const [coinResult, setCoinResult] = useState(null);
  const [spinResult, setSpinResult] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async () => {
    try {
      const response = await axiosInstance.get('/game/history');
      setGameHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const playCoinToss = async () => {
    if (betAmount < 1 || betAmount > 10) {
      toast.error('Bet amount must be between ₹1 and ₹10');
      return;
    }

    if (user.balance < betAmount) {
      toast.error('Insufficient balance');
      return;
    }

    setIsPlaying(true);
    setCoinResult(null);

    // Play coin flip sound
    playSound('flip');

    try {
      const response = await axiosInstance.post('/game/toss', {
        bet_amount: betAmount,
        choice: choice
      });

      // Delay to show animation
      setTimeout(() => {
        setCoinResult(response.data);
        updateBalance(response.data.balance);
        fetchGameHistory();

        if (response.data.won) {
          playSound('win');
          toast.success(`You won ₹${response.data.win_amount.toFixed(2)}!`);
        } else {
          playSound('lose');
          toast.error('Better luck next time!');
        }

        setIsPlaying(false);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to play game');
      setIsPlaying(false);
    }
  };

  const playSpinWheel = async () => {
    if (user.balance < 5) {
      toast.error('Insufficient balance. Need ₹5 to spin!');
      return;
    }

    setIsPlaying(true);
    setSpinResult(null);
    playSound('spin');

    try {
      const response = await axiosInstance.post('/game/spin');

      // Delay to show animation
      setTimeout(() => {
        setSpinResult(response.data);
        updateBalance(response.data.balance);
        fetchGameHistory();

        if (response.data.prize >= 100) {
          playSound('bigwin');
          toast.success(`Big Win! You won ₹${response.data.prize}!`);
        } else {
          playSound('win');
          toast.success(`You won ₹${response.data.prize}!`);
        }

        setIsPlaying(false);
      }, 4000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to play game');
      setIsPlaying(false);
    }
  };

  const playSound = (type) => {
    // Simple sound effect simulation
    const audio = new Audio();
    switch(type) {
      case 'flip':
      case 'spin':
      case 'win':
      case 'bigwin':
      case 'lose':
        // Audio URLs can be added here
        break;
      default:
        break;
    }
  };

  return (
    <div className="page-container">
      <h1 data-testid="game-title">Play Games</h1>

      {/* Balance Display */}
      <div className="card card-gold" style={{ textAlign: 'center', marginBottom: '20px' }} data-testid="game-balance-card">
        <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Your Balance</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffd700', fontFamily: 'Exo 2' }} data-testid="game-balance">
          ₹{user.balance.toFixed(2)}
        </div>
      </div>

      {/* Game Selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          className={`btn ${activeGame === 'toss' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveGame('toss')}
          style={{ flex: 1 }}
          data-testid="toss-game-tab"
        >
          <Coins size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Coin Toss
        </button>
        <button
          className={`btn ${activeGame === 'spin' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveGame('spin')}
          style={{ flex: 1 }}
          data-testid="spin-game-tab"
        >
          <Trophy size={20} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          Spin Wheel
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowHistory(!showHistory)}
          data-testid="history-toggle-btn"
        >
          <History size={20} />
        </button>
      </div>

      {/* Coin Toss Game */}
      {activeGame === 'toss' && (
        <div className="card" data-testid="coin-toss-game">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Coin Toss Game</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
            Win 1.9x your bet! Choose Heads or Tails
          </p>

          {/* Coin Animation */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <div
              className={isPlaying ? 'coin-flip' : ''}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: '800',
                color: '#0a0e27',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.5)',
                fontFamily: 'Exo 2'
              }}
              data-testid="coin-display"
            >
              {coinResult ? (coinResult.result === 'heads' ? 'H' : 'T') : '?'}
            </div>
          </div>

          {/* Bet Amount */}
          <div style={{ marginBottom: '20px' }}>
            <label>Bet Amount (₹1 - ₹10)</label>
            <input
              type="number"
              className="input-field"
              min="1"
              max="10"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              disabled={isPlaying}
              data-testid="bet-amount-input"
            />
          </div>

          {/* Choice Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label>Your Choice</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={`btn ${choice === 'heads' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setChoice('heads')}
                style={{ flex: 1 }}
                disabled={isPlaying}
                data-testid="choose-heads-btn"
              >
                Heads
              </button>
              <button
                className={`btn ${choice === 'tails' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setChoice('tails')}
                style={{ flex: 1 }}
                disabled={isPlaying}
                data-testid="choose-tails-btn"
              >
                Tails
              </button>
            </div>
          </div>

          <button
            className="btn btn-success"
            onClick={playCoinToss}
            disabled={isPlaying}
            style={{ width: '100%' }}
            data-testid="play-toss-btn"
          >
            {isPlaying ? 'Flipping...' : 'Play Now'}
          </button>

          {coinResult && !isPlaying && (
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                background: coinResult.won ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 99, 72, 0.1)',
                borderRadius: '12px',
                border: coinResult.won ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(255, 99, 72, 0.3)',
                textAlign: 'center'
              }}
              data-testid="toss-result"
            >
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: coinResult.won ? '#2ecc71' : '#ff6348' }}>
                {coinResult.won ? 'You Won!' : 'You Lost!'}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '5px' }}>
                Result: {coinResult.result.toUpperCase()}
                {coinResult.won && ` | Prize: ₹${coinResult.win_amount.toFixed(2)}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Spin Wheel Game */}
      {activeGame === 'spin' && (
        <div className="card" data-testid="spin-wheel-game">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Spin Wheel Game</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
            Cost: ₹5 per spin | Win up to ₹500!
          </p>

          {/* Wheel Display */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <div
              className={isPlaying ? 'wheel-spin' : ''}
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #ff6348 0deg 60deg, #ffd700 60deg 120deg, #2ecc71 120deg 180deg, #3498db 180deg 240deg, #9b59b6 240deg 300deg, #e74c3c 300deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                border: '8px solid #ffd700',
                fontFamily: 'Exo 2',
                position: 'relative'
              }}
              data-testid="wheel-display"
            >
              {spinResult ? `₹${spinResult.prize}` : 'SPIN'}
            </div>
          </div>

          {/* Prize Segments */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '15px', fontWeight: '600' }}>Possible Prizes:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[10, 20, 50, 100, 200, 500].map((prize) => (
                <div
                  key={prize}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    color: '#ffd700'
                  }}
                >
                  ₹{prize}
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn btn-success"
            onClick={playSpinWheel}
            disabled={isPlaying}
            style={{ width: '100%' }}
            data-testid="play-spin-btn"
          >
            {isPlaying ? 'Spinning...' : 'Spin Now (₹5)'}
          </button>

          {spinResult && !isPlaying && (
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(46, 204, 113, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(46, 204, 113, 0.3)',
                textAlign: 'center'
              }}
              data-testid="spin-result"
            >
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2ecc71' }}>You Won ₹{spinResult.prize}!</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '5px' }}>
                Net: {spinResult.prize - 5 > 0 ? '+' : ''}₹{spinResult.prize - 5}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game History */}
      {showHistory && (
        <div className="card" style={{ marginTop: '20px' }} data-testid="game-history">
          <h3 style={{ marginBottom: '20px' }}>Recent Games</h3>
          {gameHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              {gameHistory.map((game, index) => (
                <div
                  key={index}
                  data-testid={`history-item-${index}`}
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600' }}>
                      {game.game_type === 'coin_toss' ? 'Coin Toss' : 'Spin Wheel'}
                    </span>
                    <span style={{ color: game.won ? '#2ecc71' : '#ff6348', fontWeight: '600' }}>
                      {game.won ? '+' : '-'}₹{game.game_type === 'coin_toss' ? (game.won ? game.win_amount - game.bet_amount : game.bet_amount).toFixed(2) : (game.prize - 5).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {new Date(game.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>No games played yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
