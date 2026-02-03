import React, { useState } from 'react';
import axios from 'axios';
import { Send, Sparkles, User, Database, FileSpreadsheet, Cpu, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const FeedbackForm = () => {
    const [mode, setMode] = useState('manual');
    const [studentId, setStudentId] = useState('');
    const [category, setCategory] = useState('Academics');
    const [location, setLocation] = useState('Main Block');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [file, setFile] = useState(null);
    const [scanText, setScanText] = useState('');

    const simulateScanning = async () => {
        setScanning(true);
        const phrases = [
            "Initializing V5 Semantic Engine...",
            "Detecting sentiment polarity...",
            "Mapping Geo-spatial node...",
            "Authenticating Student ID...",
            "Synchronizing with Enterprise Hub..."
        ];

        for (const phrase of phrases) {
            setScanText(phrase);
            await new Promise(r => setTimeout(r, 600));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'manual') {
                await simulateScanning();
                await axios.post('http://localhost:8000/feedback', {
                    student_id: studentId,
                    category,
                    location,
                    text
                });
                setScanning(false);
                toast.success('Intelligence Logged Successfully!');
                setText('');
                setStudentId('');
            } else {
                if (!file) {
                    toast.error('File context required.');
                    setLoading(false);
                    return;
                }
                const formData = new FormData();
                formData.append('file', file);
                const response = await axios.post('http://localhost:8000/upload-feedback', formData);
                toast.success(`Batch Processed: ${response.data.count} records analyzed.`);
                setFile(null);
            }
        } catch (error) {
            console.error("Submission error", error);
            setScanning(false);
            const detail = error.response?.data?.detail || 'Connectivity failure in Intelligence Node.';
            toast.error(detail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-12 p-1 bg-gradient-to-br from-primary via-accent to-secondary rounded-[3rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom duration-700">
            {scanning && (
                <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-300">
                    <div className="relative mb-8">
                        <Cpu className="w-20 h-20 text-primary animate-pulse" />
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-white text-2xl font-black mb-4 tracking-tight tracking-widest uppercase">V5 Processing Analysis</h3>
                    <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-gradient-to-r from-primary to-accent animate-progress-ind"></div>
                    </div>
                    <p className="text-primary font-bold text-sm tracking-widest uppercase animate-pulse">{scanText}</p>
                </div>
            )}

            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.9rem] relative overflow-hidden h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-accent w-5 h-5 animate-pulse" />
                        <span className="text-accent font-black uppercase tracking-widest text-[10px]">Tier 5 Intelligence Node Active</span>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        <button
                            onClick={() => setMode('manual')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${mode === 'manual' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            MANUAL
                        </button>
                        <button
                            onClick={() => setMode('batch')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${mode === 'batch' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            BATCH
                        </button>
                    </div>
                </div>

                <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
                    {mode === 'manual' ? <>Share Your <span className="gradient-text">Insights</span></> : <>Batch <span className="gradient-text">Analysis</span></>}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    {mode === 'manual' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <User className="w-3 h-3 text-primary" /> Student Identity
                                    </label>
                                    <input required type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="ID Number" className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary transition-all font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <MapPin className="w-3 h-3 text-secondary" /> Campus Location
                                    </label>
                                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-secondary transition-all font-bold">
                                        <option>Main Block</option>
                                        <option>Hostel A</option>
                                        <option>Hostel B</option>
                                        <option>Sports Complex</option>
                                        <option>Library</option>
                                        <option>Canteen</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Database className="w-3 h-3 text-accent" /> Feedback Category
                                </label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-accent transition-all font-bold">
                                    <option>Academics</option>
                                    <option>Facilities</option>
                                    <option>Sports</option>
                                    <option>Hostel</option>
                                    <option>Placements</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <textarea required value={text} onChange={(e) => setText(e.target.value)} placeholder="Synthesize your experience..." rows="4" className="w-full p-5 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary transition-all resize-none text-lg font-medium"></textarea>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 border-4 border-dashed rounded-[2.5rem] border-slate-100 text-center cursor-pointer hover:bg-slate-50 transition-all" onClick={() => document.getElementById('fileInput').click()}>
                            <input id="fileInput" type="file" hidden accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
                            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-xl font-black text-slate-800">{file ? file.name : "Select Enterprise Data"}</p>
                        </div>
                    )}

                    <button disabled={loading} className={`w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-primary shadow-xl transition-all ${loading ? 'opacity-50' : ''}`}>
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Transmit Log</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
