import React from 'react';
import { 
  Key, 
  Users, 
  Share2, 
  Clock, 
  ArrowUpRight,
  Shield,
  Activity,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';
import { cn } from '../utils';
import { useNavigate } from 'react-router-dom';

const mockChartData = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 7 },
  { name: 'Wed', count: 5 },
  { name: 'Thu', count: 12 },
  { name: 'Fri', count: 9 },
  { name: 'Sat', count: 3 },
  { name: 'Sun', count: 6 },
];

const mockActivities = [
  { id: 1, action: 'Credential Shared', item: 'AWS Production Keys', user: 'Jane Smith', time: '2 hours ago', icon: Share2, color: 'text-blue-500' },
  { id: 2, action: 'Viewed Content', item: 'Company VPN', user: 'System', time: '5 hours ago', icon: Shield, color: 'text-slate-500' },
  { id: 3, action: 'Created New', item: 'Stripe API Secret', user: 'You', time: '1 day ago', icon: Plus, color: 'text-emerald-500' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { credentials, notifications, users } = useData();
  const navigate = useNavigate();
  const isAdmin = user?.role === UserRole.ADMIN;

  const stats = [
    { label: 'Total Credentials', value: credentials.length.toString(), icon: Key, color: 'bg-slate-900 border-slate-900' },
    { label: 'Shared With Me', value: credentials.filter(c => !c.isOwner).length.toString(), icon: Share2, color: 'bg-blue-600 border-blue-600' },
    { label: 'Pending Invites', value: notifications.filter(n => n.type === 'INVITATION' && !n.isRead).length.toString(), icon: Users, color: 'bg-amber-600 border-amber-600' },
    { label: 'Security Score', value: '98%', icon: Shield, color: 'bg-emerald-600 border-emerald-600' },
  ];

  if (isAdmin) {
    stats[0] = { label: 'System Users', value: users.length.toString(), icon: Users, color: 'bg-slate-900 border-slate-900' };
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Good morning, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your secure vault today.</p>
        </div>
        <button 
          onClick={() => navigate('/credentials?new=true')}
          className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span>New Credential</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={cn("absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 bg-slate-50 rounded-full group-hover:scale-110 transition-transform")} />
            <div className="relative">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-slate-100", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-900">Access Activity</h3>
            </div>
            <select className="bg-slate-50 border-none text-sm font-semibold text-slate-600 rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0f172a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-slate-600" />
            </div>
            <h3 className="font-bold text-slate-900">Recent Activity</h3>
          </div>

          <div className="flex-1 space-y-6">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 group">
                <div className={cn("h-10 w-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-slate-100")}>
                  <activity.icon className={cn("h-4 w-4", activity.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.item} • {activity.user}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">{activity.time}</p>
                </div>
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button className="mt-8 text-sm font-bold text-slate-900 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
}
