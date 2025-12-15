import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { Car, Hash, User, ArrowLeft } from 'lucide-react';

export default function StudentJoin() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  ];

  const handleJoin = async () => {
    if (!code.trim() || !name.trim()) {
      setError('Please enter both session code and your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Store player info
      sessionStorage.setItem('playerName', name.trim());
      sessionStorage.setItem('playerColor', color);
      sessionStorage.setItem('sessionCode', code.toUpperCase());

      setTimeout(() => {
        navigate('/race');
      }, 500);
    } catch (err) {
      setError('Failed to join session. Please check your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </button>

        {/* Card */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Join a Race</h1>
            <p className="text-sm text-slate-400">Enter your session code to get started</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Session Code"
              placeholder="e.g., ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              onKeyPress={handleKeyPress}
              icon={<Hash className="w-5 h-5" />}
              error={error}
              className="text-center font-bold tracking-wider text-lg"
            />

            <Input
              label="Your Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              icon={<User className="w-5 h-5" />}
            />

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-3">Pick Your Color</label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-full aspect-square rounded-lg transition-all ${
                      color === c
                        ? 'ring-2 ring-white scale-105'
                        : 'ring-1 ring-slate-700 hover:ring-slate-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleJoin}
              loading={loading}
              className="w-full mt-6"
            >
              {loading ? 'Joining...' : 'Join Race'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

