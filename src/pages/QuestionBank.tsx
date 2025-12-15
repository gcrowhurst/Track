import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function QuestionBank() {
  const [questions, setQuestions] = useState([
    {
      id: '1',
      text: 'What component maintains engine temperature?',
      topic: 'Cooling System',
      difficulty: 'foundation',
      correct: 0,
    },
  ]);
  const [isNewQuestionOpen, setIsNewQuestionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionTopic, setQuestionTopic] = useState('');
  const [questionDifficulty, setQuestionDifficulty] = useState('foundation');

  const handleCreateQuestion = () => {
    if (questionText.trim() && questionTopic.trim()) {
      setQuestions([
        ...questions,
        {
          id: Date.now().toString(),
          text: questionText,
          topic: questionTopic,
          difficulty: questionDifficulty as any,
          correct: 0,
        },
      ]);
      setQuestionText('');
      setQuestionTopic('');
      setQuestionDifficulty('foundation');
      setIsNewQuestionOpen(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Question Bank</h1>
              <p className="text-slate-400 mt-2">Create and manage your questions</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => setIsNewQuestionOpen(true)}>
              <Plus className="w-5 h-5" />
              New Question
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Card>
            <p className="text-slate-300 text-center py-8">No questions yet. Create one to get started!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{question.text}</h3>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span className="bg-slate-700 px-3 py-1 rounded">{question.topic}</span>
                    <span
                      className={`px-3 py-1 rounded ${
                        question.difficulty === 'foundation'
                          ? 'bg-green-900 text-green-200'
                          : question.difficulty === 'intermediate'
                          ? 'bg-yellow-900 text-yellow-200'
                          : question.difficulty === 'advanced'
                          ? 'bg-orange-900 text-orange-200'
                          : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="secondary" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Question Modal */}
      <Modal
        isOpen={isNewQuestionOpen}
        title="Create New Question"
        size="lg"
        onClose={() => setIsNewQuestionOpen(false)}
        buttons={
          <>
            <Button variant="secondary" onClick={() => setIsNewQuestionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateQuestion}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Question</label>
            <textarea
              placeholder="Enter your question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Input
            label="Topic"
            placeholder="e.g., Cooling System"
            value={questionTopic}
            onChange={(e) => setQuestionTopic(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
            <select
              value={questionDifficulty}
              onChange={(e) => setQuestionDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="foundation">Foundation</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Multiple Choice Options</label>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((letter) => (
                <Input
                  key={letter}
                  placeholder={`Option ${letter}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
