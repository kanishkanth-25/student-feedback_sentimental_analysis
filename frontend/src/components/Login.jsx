import React, { useState } from 'react';
import { Lock, User, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            onLogin();
        } else {
            alert("Security failure: Invalid identification tokens.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-6 lg:p-0">
            <div className="glass p-12 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] max-w-md w-full border-2 border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                <div className="text-center mb-10 relative">
                    <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-4 text-primary">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-primary italic">Portal</span></h2>
                    <p className="text-slate-500 font-medium">Authentication required to access intelligence.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Access Token ID</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Identification"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-800"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Security Cipher</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-800"
                            />
                        </div>
                    </div>
                    <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-primary transition-all shadow-xl hover:shadow-primary/40 active:scale-95">
                        Authorize Access
                    </button>
                    <p className="text-center text-xs text-slate-400 font-medium">Standard security protocols active.</p>
                </form>
            </div>
        </div>
    );
};

export default Login;
