import React from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Smartphone, 
  Globe, 
  Clock,
  Camera,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn, formatDate } from '../utils';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-slate-900 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-lg shadow-slate-200/50">
            <div className="h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-3xl text-slate-400 relative">
              {user?.name.charAt(0)}
              <button className="absolute -right-2 -bottom-2 h-8 w-8 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user?.name}</h1>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold uppercase tracking-widest rounded-full">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            <h3 className="font-bold text-slate-900">Personal Information</h3>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
              <input 
                defaultValue={user?.name}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input 
                defaultValue={user?.email}
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Member Since</label>
              <p className="px-4 py-2.5 bg-slate-50 border border-slate-50 text-slate-600 font-medium rounded-xl">
                {formatDate(user?.createdAt || '')}
              </p>
            </div>
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]">
              Update Profile
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <Lock className="h-4 w-4 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-900">Change Password</h3>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                <input 
                  type="password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                />
              </div>
              <button className="w-full bg-white text-slate-900 border border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]">
                Securely Update Password
              </button>
            </form>
          </div>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-emerald-900">Security Checkup</h3>
            </div>
            <p className="text-sm text-emerald-700/80 mb-6">Your account is secured with 2FA and recent activity looks regular.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-800">
                <Check className="h-4 w-4" /> Two-factor authentication active
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-800">
                <Check className="h-4 w-4" /> Device recognized: iPhone 15 Pro
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
