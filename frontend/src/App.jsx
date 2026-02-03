import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { LayoutDashboard, GraduationCap, Github } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [view, setView] = useState('student'); // 'student', 'admin', 'dashboard'
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    setIsAdmin(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setView('student');
  };

  return (
    <div className="min-h-screen font-sans">
      <Toaster position="top-right" />
      {/* Dynamic Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-accent/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Dynamic Floating Navigation */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-10 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 flex gap-12 items-center border-2 border-white/80 scale-110 md:scale-100">
        <button
          onClick={() => setView('student')}
          className={`flex items-center gap-3 font-black px-6 py-3 rounded-2xl transition-all duration-300 ${view === 'student' ? 'bg-primary text-white shadow-xl shadow-primary/40 -translate-y-1' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}
        >
          <GraduationCap className="w-6 h-6" />
          <span className="hidden md:inline">Feedback</span>
        </button>
        <button
          onClick={() => setView(isAdmin ? 'dashboard' : 'admin')}
          className={`flex items-center gap-3 font-black px-6 py-3 rounded-2xl transition-all duration-300 ${view !== 'student' ? 'bg-primary text-white shadow-xl shadow-primary/40 -translate-y-1' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="hidden md:inline">Analytics</span>
        </button>
      </nav>

      {/* Top Header Branding */}
      <header className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-xl font-black italic text-xl">
            SF
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight hidden sm:block">STUDENT<span className="text-primary italic">FEEDBACK</span></span>
        </div>
        <a href="#" className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
          <Github className="w-5 h-5" />
          <span className="text-sm">V1.0</span>
        </a>
      </header>

      {/* Main Content Area */}
      <main className="pb-40 pt-4 px-6 md:px-0">
        {view === 'student' && <FeedbackForm />}
        {view === 'admin' && <Login onLogin={handleLogin} />}
        {view === 'dashboard' && <AdminDashboard onLogout={handleLogout} />}
      </main>

      {/* Decorative footer text */}
      <div className="fixed top-1/2 -left-20 -rotate-90 opacity-[0.03] pointer-events-none select-none">
        <span className="text-8xl font-black tracking-widest whitespace-nowrap uppercase">Innovation Excellence</span>
      </div>
      <div className="fixed top-1/2 -right-20 rotate-90 opacity-[0.03] pointer-events-none select-none">
        <span className="text-8xl font-black tracking-widest whitespace-nowrap uppercase">Intelligence Analytics</span>
      </div>
    </div>
  );
}

export default App;
