import { useParams, useNavigate } from 'react-router-dom';
import { Users, Settings, Zap, Trophy } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useResponsive } from '../hooks/useResponsive';

export default function SessionLobby() {
  const navigate = useNavigate();
  useParams();
  const { isMobile } = useResponsive();

  const participants = [
    { id: '1', name: 'Sarah', color: '#3b82f6', ready: true },
    { id: '2', name: 'James', color: '#ef4444', ready: false },
    { id: '3', name: 'Emma', color: '#22c55e', ready: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 safe-top relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-white" />
            <h1 className={`font-bold text-white ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
              Session Lobby
            </h1>
          </div>
          <p className={`text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
            🚀 Get ready to race! Waiting for other participants...
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className={`gap-8 ${isMobile ? 'grid' : 'grid lg:grid-cols-3'}`}>
          {/* Track Preview */}
          <div className={isMobile ? '' : 'lg:col-span-2'}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-300" />
                <h2 className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  🏁 Cooling Corners
                </h2>
              </div>
              
              {/* Track Visualization */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl w-full h-48 sm:h-64 flex items-center justify-center text-white/60 font-semibold text-lg mb-6">
                [Track Visualization Coming Soon]
              </div>

              {/* Track Stats Grid */}
              <div className={`gap-4 ${isMobile ? 'grid grid-cols-2' : 'grid grid-cols-4'}`}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <p className="text-white/70 text-xs sm:text-sm font-medium">🎯 Difficulty</p>
                  <p className="text-white font-bold text-lg mt-1">Intermediate</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <p className="text-white/70 text-xs sm:text-sm font-medium">📍 Checkpoints</p>
                  <p className="text-white font-bold text-lg mt-1">8</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <p className="text-white/70 text-xs sm:text-sm font-medium">🔄 Laps</p>
                  <p className="text-white font-bold text-lg mt-1">3</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <p className="text-white/70 text-xs sm:text-sm font-medium">⏱️ Est. Time</p>
                  <p className="text-white font-bold text-lg mt-1">15 mins</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Participants Sidebar */}
          <div>
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-blue-300" />
                <h2 className="text-2xl font-bold text-white">Racers</h2>
                <span className="ml-auto bg-blue-500/50 text-white text-sm px-3 py-1 rounded-full font-semibold">
                  {participants.length} ready
                </span>
              </div>

              {/* Participants List */}
              <div className="space-y-3 mb-8">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:border-white/40 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-white font-semibold">{p.name}</span>
                    </div>
                    {p.ready ? (
                      <span className="text-green-300 text-xs font-bold bg-green-500/20 px-2 py-1 rounded-full">✓ Ready</span>
                    ) : (
                      <span className="text-yellow-300 text-xs font-bold bg-yellow-500/20 px-2 py-1 rounded-full">⏳ Waiting</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Settings Button */}
              <Button variant="secondary" size="md" className="w-full mb-3">
                <Settings className="w-4 h-4" />
                Vehicle Settings
              </Button>

              {/* Ready Button */}
              <Button 
                variant="success" 
                size="lg" 
                className="w-full font-bold text-lg"
                onClick={() => navigate('/race')}
              >
                🚀 Ready to Race!
              </Button>

              {/* Tip */}
              <p className="text-white/70 text-xs text-center mt-4">
                💡 Answer questions correctly to move forward!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
