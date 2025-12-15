import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store';
import { supabase } from './services/supabase';
import { detectDevice } from './utils/deviceDetection';

// Pages
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentJoin from './pages/StudentJoin';
import RacingActivity from './pages/RacingActivity';
import TrackBuilder from './pages/TrackBuilder';
import QuestionBank from './pages/QuestionBank';
import SessionLobby from './pages/SessionLobby';

// Components
import Notification from './components/Notification';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Initialize device detection
    const device = detectDevice();
    console.log('Device detected:', device);
    
    // Store device info in a global for easy access
    (window as any).__CIRCUIT_DEVICE_INFO__ = device;
    
    // Apply device-specific optimizations
    if (device.isMobile) {
      document.documentElement.classList.add('mobile');
    }
    if (device.isTablet) {
      document.documentElement.classList.add('tablet');
    }
    if (device.prefersDarkMode) {
      document.documentElement.classList.add('dark');
    }
    if (device.prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setUser(profile);
        }
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setUser(profile);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/questions" element={<QuestionBank />} />
          <Route path="/teacher/tracks" element={<TrackBuilder />} />
          <Route path="/student/join" element={<StudentJoin />} />
          <Route path="/session/:sessionId/lobby" element={<SessionLobby />} />
          <Route path="/session/:sessionId/race" element={<RacingActivity />} />
        </Routes>
        <Notification />
      </div>
    </BrowserRouter>
  );
}

export default App;
