import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Play, ArrowLeft } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([
    {
      id: '1',
      name: 'Morning Chemistry Challenge',
      track: 'Cooling Corners',
      participants: 12,
      status: 'finished',
      date: '2025-12-15',
    },
  ]);
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');

  const handleCreateSession = () => {
    if (sessionName.trim()) {
      setSessions([
        ...sessions,
        {
          id: Date.now().toString(),
          name: sessionName,
          track: 'Rookie Circuit',
          participants: 0,
          status: 'waiting',
          date: new Date().toISOString().split('T')[0],
        },
      ]);
      setSessionName('');
      setIsNewSessionOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/10 text-green-400 border-green-500/20',
      waiting: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      finished: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return styles[status as keyof typeof styles] || styles.finished;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>
              <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>
            </div>
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => setIsNewSessionOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Session
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Sessions List */}
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-12 text-center">
              <p className="text-slate-400 mb-4">No sessions yet</p>
              <Button variant="primary" onClick={() => setIsNewSessionOpen(true)}>
                Create Your First Session
              </Button>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 sm:p-6 hover:border-slate-700/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{session.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{session.track}</span>
                      <span>•</span>
                      <span>{session.participants} participants</span>
                      <span>•</span>
                      <span>{session.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {session.status === 'waiting' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/session/${session.id}/lobby`)}
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/session/${session.id}/lobby`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      <Modal
        isOpen={isNewSessionOpen}
        onClose={() => setIsNewSessionOpen(false)}
        title="Create New Session"
      >
        <div className="space-y-4">
          <Input
            label="Session Name"
            placeholder="e.g., Morning Quiz"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsNewSessionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSession}
            >
              Create Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
