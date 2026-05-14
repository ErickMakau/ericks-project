import React from 'react';
import { 
  Shield, 
  Lock, 
  Edit3, 
  Trash2, 
  Share2, 
  Eye, 
  Copy, 
  MoreVertical,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { Credential, UserRole } from '../types';
import { cn, formatDate } from '../utils';
import { useAuth } from '../context/AuthContext';

interface CredentialCardProps {
  key?: React.Key;
  credential: Credential;
  onView: (credential: Credential) => void;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
  onShare: (credential: Credential) => void;
}

export function CredentialCard({ 
  credential, 
  onView, 
  onEdit, 
  onDelete, 
  onShare 
}: CredentialCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isOwner = credential.isOwner || (isAdmin && credential.ownerId === user?.id);
  const canEdit = isOwner || credential.permission === 'READ_WRITE';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-200/40 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
            isOwner ? "bg-slate-900 border-slate-900 text-white" : "bg-blue-50 border border-blue-100 text-blue-600"
          )}>
            {isOwner ? <Shield className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight group-hover:text-slate-900">{credential.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border",
                isOwner 
                  ? "bg-slate-50 border-slate-200 text-slate-600" 
                  : "bg-blue-50 border-blue-100 text-blue-600"
              )}>
                {isOwner ? 'Owner' : 'Shared'}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border bg-slate-50 border-slate-200 text-slate-500">
                {credential.permission === 'READ_WRITE' ? 'Read/Write' : 'Read Only'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onView(credential)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {canEdit && (
            <button 
              onClick={() => onEdit(credential)}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          {isOwner && (
            <button 
              onClick={() => onDelete(credential.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">
        {credential.description || 'No description provided.'}
      </p>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                <UserIcon className="h-3 w-3" />
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            {isOwner ? `Shared with ${credential.sharedWith.length} users` : `By ${credential.ownerName}`}
          </p>
        </div>

        <button 
          onClick={() => onShare(credential)}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
