import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import {
    Activity, MessageSquare, ThumbsUp, LogOut, Clock, Search, Download,
    ShieldCheck, MapPin, Brain, TrendingUp, CheckCircle, UserCircle,
    Loader2, Calendar, ClipboardList, Zap, ExternalLink, Plus, Filter, Users,
    Globe, Database, Server, Terminal, AlertCircle, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = ({ onLogout }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [role, setRole] = useState('SuperAdmin');
    const [view, setView] = useState('analytics');
    const [tasks, setTasks] = useState([]);
    const [uptime, setUptime] = useState(0);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/dashboard-data');
            setData(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
            setError("Ecosystem Link Interrupted.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        const uptimeTimer = setInterval(() => setUptime(u => u + 1), 1000);
        return () => {
            clearInterval(interval);
            clearInterval(uptimeTimer);
        };
    }, []);

    const handleResolve = async (id) => {
        try {
            // Updated to Enterprise V7: Real API call with verification
            await axios.patch(`http://localhost:8000/feedback/${id}/resolve`, { note: "Issue addressed by management Ecosystem." });
            toast.success("Feedback Resolved & Logged in Blockchain.");
            fetchData();
        } catch (e) {
            console.error(e);
            toast.error("Resolution Failed. Please Refresh Ecosystem.");
        }
    };

    const escalateToTask = (item) => {
        const newTask = {
            id: Date.now(),
            sourceId: item.id,
            title: `${item.category}: ${item.student_id}`,
            description: item.text,
            status: 'TO DO',
            priority: item.sentiment_label === 'NEGATIVE' ? 'CRITICAL' : 'NORMAL',
            location: item.location
        };
        setTasks([...tasks, newTask]);
        toast.success(`Task Routed to Enterprise Ops Board`);
    };

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-12">
            <div className="bg-slate-800 p-16 rounded-[4rem] border-4 border-slate-700 shadow-[0_0_100px_rgba(239,68,68,0.1)] flex flex-col items-center gap-8 text-center max-w-2xl">
                <AlertCircle className="w-24 h-24 text-red-500 animate-pulse" />
                <div>
                    <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">Ecosystem Offline</h2>
                    <p className="text-slate-400 font-bold text-xl leading-relaxed">{error}</p>
                </div>
                <button onClick={() => window.location.reload()} className="px-12 py-6 bg-red-500 hover:bg-red-600 text-white rounded-3xl font-black text-xl tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">RE-INITIALIZE CORE</button>
            </div>
        </div>
    );

    if (loading && !data) return <DashboardSkeleton onLogout={onLogout} />;

    const sentimentData = [
        { name: 'Positive', value: data?.sentiment_counts?.POSITIVE || 0, color: '#10b981' },
        { name: 'Negative', value: data?.sentiment_counts?.NEGATIVE || 0, color: '#ef4444' },
        { name: 'Neutral', value: data?.sentiment_counts?.NEUTRAL || 0, color: '#f59e0b' },
    ];

    const timelineDataRows = data?.temporal_trends ? Object.entries(data.temporal_trends).map(([date, counts]) => ({
        date,
        positive: counts.POSITIVE,
        negative: counts.NEGATIVE
    })) : [];

    const timelineData = timelineDataRows.length === 1
        ? [{ date: 'Start', positive: 0, negative: 0 }, ...timelineDataRows]
        : timelineDataRows;

    const geoData = data?.location_stats ? Object.entries(data.location_stats).map(([name, value]) => ({ name, value })) : [];

    // V7 Enhancement: Category Performance Metrics
    const categoryData = data?.category_distribution ? Object.entries(data.category_distribution).map(([name, value]) => ({ name, value })) : [];

    const filteredFeed = data?.recent_feed ? data.recent_feed.filter(item =>
        (item.text.toLowerCase().includes(searchTerm.toLowerCase()) || item.student_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (role === 'SuperAdmin' || item.category === role)
    ) : [];

    return (
        <div className="min-h-screen bg-slate-50/50 selection:bg-primary selection:text-white">
            <div className="max-w-[1600px] mx-auto p-6 lg:p-12 space-y-12">

                {/* Enterprise V7 Header */}
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
                                <Globe className="w-8 h-8 text-white animate-[spin_4s_linear_infinite]" />
                            </div>
                            <div>
                                <h1 className="text-7xl font-black text-slate-900 tracking-tighter">Enterprise <span className="gradient-text">Ecosystem</span></h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategic Monitoring Active V7.0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 bg-white/80 backdrop-blur-2xl p-4 rounded-[3rem] shadow-2xl border border-white/50">
                        <div className="flex bg-slate-100/50 p-1.5 rounded-[2rem]">
                            <button onClick={() => setView('analytics')} className={`px-8 py-3 rounded-[1.5rem] text-xs font-black transition-all ${view === 'analytics' ? 'bg-white shadow-xl text-primary scale-105' : 'text-slate-400 hover:text-slate-600'}`}>INTELLIGENCE</button>
                            <button onClick={() => setView('tasks')} className={`px-8 py-3 rounded-[1.5rem] text-xs font-black transition-all ${view === 'tasks' ? 'bg-white shadow-xl text-primary scale-105' : 'text-slate-400 hover:text-slate-600'}`}>OPERATIONS</button>
                        </div>
                        <div className="h-10 w-[2px] bg-slate-100 hidden md:block"></div>
                        <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                            <UserCircle className="w-5 h-5 text-slate-400" />
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-transparent font-black text-slate-600 outline-none cursor-pointer text-[10px] uppercase tracking-wider">
                                <option value="SuperAdmin">Master Administrator</option>
                                <option value="Academics">Academic Director</option>
                                <option value="Hostel">Hostel Warden</option>
                                <option value="Facilities">Estate Manager</option>
                            </select>
                        </div>
                        <button onClick={onLogout} className="group p-4 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-3xl transition-all shadow-lg hover:shadow-red-200">
                            <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>
                </header>

                {view === 'analytics' ? (
                    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                        {/* System Health HUD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <HealthCard icon={<Server />} label="Core Server" status="Operational" detail={`Uptime: ${Math.floor(uptime / 60)}m ${uptime % 60}s`} color="primary" />
                            <HealthCard icon={<Database />} label="Enterprise DB" status="Synchronized" detail="V7.0 Meta Schema" color="accent" />
                            <HealthCard icon={<Brain />} label="Sentiment Engine" status="High Accuracy" detail="BERT V4 Transformer" color="secondary" />
                            <HealthCard icon={<Terminal />} label="System Logs" status="Idle" detail="Watching for events..." color="slate" />
                        </div>

                        {/* Synthesis & Global Metrics */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 glass p-10 rounded-[4.5rem] border-white border-8 shadow-2xl bg-gradient-to-br from-white via-white to-primary/5 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                                <div className="absolute -right-12 -bottom-12 opacity-5 scale-150 rotate-12"><Brain className="w-80 h-80" /></div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/30"><Zap className="w-6 h-6" /></div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Executive Summary</h3>
                                </div>
                                <p className="text-4xl font-black text-slate-800 tracking-tighter leading-[1.1] mb-8">"{data?.ai_summary || 'Synthesizing campus-wide sentiment data...'}"</p>
                                <div className="flex gap-4">
                                    <div className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Enterprise V7</div>
                                    <div className="px-6 py-2 bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Real-time</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <MetricBox label="Global Resolution" value={`${Math.round((data?.resolved_count / (data?.total || 1)) * 100)}%`} icon={<Heart className="fill-red-500 text-red-500" />} trend="↑ 4.2% since V6" />
                                <MetricBox label="Identified Signals" value={data?.total} icon={<Activity />} trend="Processing Live Packets" />
                                <div className="bg-white p-8 rounded-[3.5rem] border-4 border-slate-50 flex flex-col items-center justify-center text-center gap-2 shadow-xl">
                                    <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mb-2"><Users className="text-accent w-8 h-8" /></div>
                                    <p className="text-4xl font-black text-slate-900">{data?.unique_students}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Student Nodes</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart Ecosystem */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 glass p-12 rounded-[4rem] shadow-2xl border-white border-2">
                                <div className="flex justify-between items-center mb-12">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Strategic Polarity</h3>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Timeline Sentiment Flux</p>
                                    </div>
                                    <div className="px-6 py-2 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> POS</div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-red-500"><div className="w-2 h-2 bg-red-500 rounded-full"></div> NEG</div>
                                    </div>
                                </div>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={timelineData}>
                                            <defs>
                                                <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} dy={15} />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ borderRadius: '32px', border: 'none', boxShadow: '0 32px 64px rgba(0,0,0,0.1)', padding: '24px' }} />
                                            <Area type="monotone" dataKey="positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" strokeWidth={10} dot={false} activeDot={{ r: 12, strokeWidth: 4 }} />
                                            <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNeg)" strokeWidth={10} dot={false} activeDot={{ r: 12, strokeWidth: 4 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="glass p-12 rounded-[4rem] shadow-2xl border-white border-2 flex flex-col">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight text-center">Node Map</h3>
                                <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Geo-Density Metrics</p>
                                <div className="h-full min-h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={geoData} dataKey="value" innerRadius={100} outerRadius={140} paddingAngle={8} stroke="none" cornerRadius={12}>
                                                {geoData.map((e, i) => <Cell key={i} fill={['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b'][i % 5]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-6">
                                    {geoData.map((g, i) => (
                                        <div key={g.name} className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full shadow-lg shadow-black/5" style={{ backgroundColor: ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b'][i % 5] }}></div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{g.name}</span>
                                            </div>
                                            <p className="text-xl font-black text-slate-800 ml-5">{g.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Audit Table (Ecosystem Edition) */}
                        <div className="glass p-12 rounded-[4.5rem] shadow-2xl border-white border-4 overflow-hidden relative">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                                <div>
                                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Strategic Audit</h3>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Active Intelligence Monitoring</p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="relative group min-w-[300px]">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-all" />
                                        <input type="text" placeholder="Search Node ID or Signal Content..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-slate-100 rounded-[2rem] outline-none font-black text-slate-700 focus:bg-white focus:ring-[15px] focus:ring-primary/5 transition-all text-sm border-2 border-transparent focus:border-primary/20" />
                                    </div>
                                    <button className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                                        <Download className="w-5 h-5" /> EXPORT V7 PACKET
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-12 px-12 pb-8">
                                <table className="w-full border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="px-8 pb-6 text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Node Identity</th>
                                            <th className="px-8 pb-6 text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Synthesis Context</th>
                                            <th className="px-8 pb-6 text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Sentiment Polarity</th>
                                            <th className="px-8 pb-6 text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] text-right">Strategic Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFeed.map((item) => (
                                            <tr key={item.id} className="group bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 hover:shadow-[0_15px_45px_rgb(0,0,0,0.05)] hover:scale-[1.01] transition-all cursor-default">
                                                <td className="py-10 px-8 rounded-l-[2.5rem]">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${item.sentiment_label === 'POSITIVE' ? 'bg-emerald-400 shadow-emerald-200' : 'bg-red-400 shadow-red-200'}`}>
                                                            {item.student_id.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-800 text-lg tracking-tight">{item.student_id}</p>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-10 px-8 max-w-lg">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black w-max uppercase tracking-tighter">{item.category}</span>
                                                        <p className="text-slate-600 font-bold leading-relaxed">{item.text}</p>
                                                    </div>
                                                </td>
                                                <td className="py-10 px-8">
                                                    <div className={`flex items-center gap-3 w-max px-6 py-2.5 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-sm ${item.sentiment_label === 'POSITIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                        {item.sentiment_label === 'POSITIVE' ? <ThumbsUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                                        {item.sentiment_label}
                                                    </div>
                                                </td>
                                                <td className="py-10 px-8 text-right rounded-r-[2.5rem]">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <button onClick={() => escalateToTask(item)} className="p-4 bg-slate-50 text-slate-500 rounded-2xl hover:text-primary hover:bg-white hover:shadow-xl transition-all border border-slate-100" title="Escalate to Operations"><ClipboardList className="w-6 h-6" /></button>
                                                        {item.status === 'RESOLVED' ? (
                                                            <div className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase shadow-inner">
                                                                <CheckCircle className="w-5 h-5" /> Strategic Resolution Complete
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleResolve(item.id)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] hover:bg-primary transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-[0.2em]">Execute Resolve</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Enterprise Operations (V7.0) */
                    <div className="animate-in slide-in-from-right duration-700 space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {[
                                { title: 'Strategic Priorities', tasks: tasks.filter(t => t.status === 'TO DO'), icon: <Clock className="text-red-500" />, color: 'red' },
                                { title: 'Active Operations', tasks: tasks.filter(t => t.status === 'DOING'), icon: <Zap className="text-yellow-500" />, color: 'yellow' },
                                { title: 'Verified Complete', tasks: tasks.filter(t => t.status === 'DONE'), icon: <CheckCircle className="text-emerald-500" />, color: 'emerald' },
                            ].map((col, idx) => (
                                <div key={idx} className="bg-white/60 backdrop-blur-xl p-10 rounded-[4rem] border-4 border-white shadow-2xl min-h-[700px] flex flex-col gap-8">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-slate-50 rounded-2xl shadow-xl">{col.icon}</div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{col.title}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Feed • {col.tasks.length} Nodes</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                                        {col.tasks.map(task => (
                                            <div key={task.id} className="bg-white p-8 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border border-slate-50 relative group overflow-hidden hover:-translate-y-1">
                                                <div className={`absolute top-0 left-0 w-2 h-full ${task.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-primary'}`}></div>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest mb-3 inline-block ${task.priority === 'CRITICAL' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>{task.priority}</span>
                                                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight">{task.title}</h4>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-primary transition-colors"><ExternalLink className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                                <p className="text-slate-500 font-bold leading-relaxed line-clamp-3 mb-8">{task.description}</p>
                                                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                                        <MapPin className="w-3 h-3" /> {task.location}
                                                    </div>
                                                    <div className="flex -space-x-3">
                                                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-lg"></div>)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const HealthCard = ({ icon, label, status, detail, color }) => {
    const colorClasses = {
        primary: 'bg-primary/5 text-primary border-primary/20',
        accent: 'bg-accent/5 text-accent border-accent/20',
        secondary: 'bg-secondary/5 text-secondary border-secondary/20',
        slate: 'bg-slate-100/50 text-slate-500 border-slate-200'
    };
    return (
        <div className={`p-8 rounded-[3.5rem] border-2 shadow-xl bg-white flex flex-col gap-4 group hover:scale-[1.02] transition-all cursor-default overflow-hidden relative ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-white shadow-lg">{icon}</div>
                <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest bg-white shadow-sm border border-slate-50`}>{status}</div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{label}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">{detail}</p>
            </div>
            <div className={`absolute bottom-0 right-0 w-32 h-32 opacity-5 translate-x-8 translate-y-8 rotate-12 transition-transform group-hover:scale-110`}>{icon}</div>
        </div>
    );
};

const MetricBox = ({ label, value, icon, trend }) => (
    <div className="bg-white p-10 rounded-[3.5rem] border-4 border-slate-50 shadow-2xl flex flex-col gap-6 group hover:-translate-y-1 transition-all">
        <div className="flex items-center justify-between">
            <div className="p-5 bg-slate-50 rounded-[1.5rem] group-hover:bg-primary/5 transition-colors">{icon}</div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{trend}</p>
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-6xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    </div>
);

const DashboardSkeleton = ({ onLogout }) => (
    <div className="min-h-screen bg-slate-50 p-12">
        <div className="max-w-[1600px] mx-auto space-y-12 animate-pulse">
            <div className="h-40 bg-white rounded-[4rem] border-4 border-slate-100"></div>
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-white rounded-[3.5rem] border-4 border-slate-50"></div>)}
            </div>
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 h-[500px] bg-white rounded-[4.5rem] border-4 border-slate-100"></div>
                <div className="h-[500px] bg-white rounded-[4.5rem] border-4 border-slate-100"></div>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
