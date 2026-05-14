import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Key, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';
import { cn } from '../utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  count?: number;
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems: NavItemProps[] = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/credentials', icon: Key, label: 'Credentials' },
    { to: '/notifications', icon: Bell, label: 'Notifications', count: unreadCount > 0 ? unreadCount : undefined },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ to: '/admin', icon: ShieldCheck, label: 'Admin Panel' });
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:static lg:translate-x-0 outline-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Key className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">SecureVault</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group",
                    isActive 
                      ? "bg-slate-900 text-white" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full font-semibold",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 mb-4 rounded-lg bg-slate-50">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group"
            >
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-rose-500" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <button 
            className="p-2 -ml-2 text-slate-500 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 lg:px-0">
            <h1 className="text-lg font-semibold text-slate-900 lg:hidden">
              {navItems.find(i => i.to === location.pathname)?.label || 'Page'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
