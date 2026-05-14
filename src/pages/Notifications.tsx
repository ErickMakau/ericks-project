import React from 'react';
import { 
  Bell, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2,
  ArrowRight
} from 'lucide-react';
import { cn } from '../utils';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { notifications, markAllAsRead, deleteNotification } = useData();

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'INVITATION': return { icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'ACCEPTANCE': return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      default: return { icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-50' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Intelligence & Alerts</h1>
          <p className="text-slate-500">Security notifications and access requests.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-slate-900 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const style = getTypeStyles(notif.type);
            return (
              <div key={notif.id} className={cn(
                "p-6 flex gap-4 hover:bg-slate-50 transition-colors group",
                !notif.isRead && "bg-slate-50/50"
              )}>
                <div className={cn("h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center", style.bg)}>
                  <style.icon className={cn("h-6 w-6", style.color)} />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{notif.title}</h4>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{notif.description}</p>
                  
                  {notif.type === 'INVITATION' && !notif.isRead && (
                    <div className="pt-4 flex gap-3">
                      <Link 
                        to={`/invitation/${notif.relatedId}/${notif.id}`}
                        className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2"
                      >
                        View Invitation <ArrowRight className="h-3 w-3" />
                      </Link>
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="bg-white text-slate-600 border border-slate-200 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-50 transition-all"
                      >
                        Ignore
                      </button>
                    </div>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start">
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
              <Bell className="h-6 w-6 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-900">Your vault is quiet</h4>
            <p className="text-sm text-slate-500 mt-1">No new security notifications at the moment.</p>
          </div>
        )}
      </div>

      {/* Activity Summary Sidebar could go here if layout supported columns */}
    </div>
  );
}
