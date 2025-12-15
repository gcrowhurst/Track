import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function TrackBuilder() {
  const [tracks, setTracks] = useState([
    {
      id: '1',
      name: 'Rookie Circuit',
      difficulty: 'beginner',
      checkpoints: 3,
      length: 'Short',
    },
  ]);
  const [isNewTrackOpen, setIsNewTrackOpen] = useState(false);
  const [trackName, setTrackName] = useState('');

  const handleCreateTrack = () => {
    if (trackName.trim()) {
      setTracks([
        ...tracks,
        {
          id: Date.now().toString(),
          name: trackName,
          difficulty: 'beginner',
          checkpoints: 0,
          length: 'Custom',
        },
      ]);
      setTrackName('');
      setIsNewTrackOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Track Builder</h1>
              <p className="text-slate-400 mt-2">Create and customize racing tracks</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => setIsNewTrackOpen(true)}>
              <Plus className="w-5 h-5" />
              New Track
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Card key={track.id} className="flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-2">{track.name}</h3>
              <div className="bg-slate-700 rounded-lg w-full h-48 flex items-center justify-center text-slate-400 mb-4">
                [Track Preview]
              </div>
              <div className="flex-1">
                <div className="space-y-2 text-sm text-slate-300 mb-4">
                  <p>
                    Difficulty: <span className="text-white font-semibold">{track.difficulty}</span>
                  </p>
                  <p>
                    Checkpoints: <span className="text-white font-semibold">{track.checkpoints}</span>
                  </p>
                  <p>
                    Length: <span className="text-white font-semibold">{track.length}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="danger" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {/* Add New Track Card */}
          <Card
            onClick={() => setIsNewTrackOpen(true)}
            className="flex flex-col items-center justify-center min-h-64 cursor-pointer hover:bg-slate-700"
          >
            <Plus className="w-12 h-12 text-slate-500 mb-4" />
            <p className="text-slate-400 text-center">Create a new track</p>
          </Card>
        </div>
      </div>

      {/* New Track Modal */}
      <Modal
        isOpen={isNewTrackOpen}
        title="Create New Track"
        onClose={() => setIsNewTrackOpen(false)}
        buttons={
          <>
            <Button variant="secondary" onClick={() => setIsNewTrackOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTrack}>
              Create
            </Button>
          </>
        }
      >
        <Input
          label="Track Name"
          placeholder="e.g., Speed Valley"
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
          autoFocus
        />
      </Modal>
    </div>
  );
}
