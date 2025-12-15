import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Zap, Trophy, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Circuit Challenge</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Teacher Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-400">Educational Racing Game</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Learn Through Competition.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
              Race to Victory.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Answer questions correctly to power your car forward. Compete with classmates in real-time educational races.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/student/join')}
            >
              Join a Race
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Create Session
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">1M+</div>
            <div className="text-sm text-slate-400">Races Completed</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-500 mb-1">100K+</div>
            <div className="text-sm text-slate-400">Active Students</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-1">10K+</div>
            <div className="text-sm text-slate-400">Questions Answered</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 py-16 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Why Students Love It</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Engaging Format</h3>
              <p className="text-sm text-slate-400">Racing mechanics make learning feel like playing a game</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Competition</h3>
              <p className="text-sm text-slate-400">Race against classmates and see results instantly</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Achievements</h3>
              <p className="text-sm text-slate-400">Earn rewards and climb the leaderboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center">
        <p className="text-sm text-slate-500">© 2025 Circuit Challenge. Making learning fun.</p>
      </footer>
    </div>
  );
}
