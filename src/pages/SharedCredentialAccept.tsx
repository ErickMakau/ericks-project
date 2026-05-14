import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Key
} from 'lucide-react';
import { cn } from '../utils';
import { useData } from '../context/DataContext';

export default function SharedCredentialAcceptPage() {
  const { id, notificationId } = useParams();
  const navigate = useNavigate();
  const { handleInvitationAction, notifications } = useData();
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  const notification = notifications.find(n => n.id === notificationId);

  const handleAccept = async () => {
    setStatus('PROCESSING');
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (notificationId) {
      handleInvitationAction(notificationId, 'ACCEPT');
    }
    setStatus('SUCCESS');
    setTimeout(() => navigate('/credentials'), 2000);
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to decline this secure invitation?')) {
      if (notificationId) {
        handleInvitationAction(notificationId, 'REJECT');
      }
      navigate('/notifications');
    }
  };

  if (!notification) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Verifying invitation signature...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Alerts
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-200">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Secure Access Invitation</h1>
          <p className="text-slate-500 mt-2">You have been granted access to a protected credential.</p>
        </div>

        <div className="p-8">
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resource</span>
              <span className="text-sm font-bold text-slate-900">{notification.title}</span>
            </div>
            <div className="sm:col-span-2 space-y-1 pt-2">
               <p className="text-sm text-slate-600 leading-relaxed">{notification.description}</p>
            </div>
          </div>

          {status === 'IDLE' ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAccept}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-5 w-5" />
                Accept Access Invitation
              </button>
              <button 
                onClick={handleReject}
                className="w-full bg-white text-slate-600 font-bold py-4 rounded-2xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
              >
                Decline Invitation
              </button>
            </div>
          ) : status === 'PROCESSING' ? (
            <div className="text-center py-4 space-y-4">
              <Loader2 className="h-8 w-8 text-slate-900 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-900">Synchronizing vault permissions...</p>
            </div>
          ) : status === 'SUCCESS' ? (
            <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-lg font-bold text-slate-900">Access Granted</p>
              <p className="text-sm text-slate-500 mt-1">Redirecting you to your vault...</p>
            </div>
          ) : (
            <div className="text-center py-4 text-rose-600">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" />
              <p className="font-bold">Encryption Protocol Error</p>
              <p className="text-sm opacity-80">Please contact the administrator.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <Lock className="h-4 w-4 text-slate-400" />
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            By accepting this invitation, you agree to the organization's data handling policies. All access attempts are decrypted and logged for security auditing.
          </p>
        </div>
      </div>
    </div>
  );
}
