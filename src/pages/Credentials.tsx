import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  SearchX, 
  Loader2,
  Copy,
  Check,
  Eye,
  Key
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Credential, Permission } from '../types';
import { CredentialCard } from '../components/CredentialCard';
import { Modal } from '../components/Modal';
import { ConfirmPasswordModal } from '../components/ConfirmPasswordModal';
import { cn } from '../utils';
import { useData } from '../context/DataContext';

const credentialSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  sensitiveContent: z.string().min(1, 'Sensitive content is required'),
  shareWith: z.string().optional(),
  permission: z.enum(['READ_ONLY', 'READ_WRITE']),
});

type CredentialForm = z.infer<typeof credentialSchema>;

export default function CredentialsPage() {
  const { credentials, addCredential, updateCredential, deleteCredential } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CredentialForm>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      permission: 'READ_ONLY',
    }
  });

  const filteredCredentials = credentials.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setSelectedCredential(null);
    setIsViewing(false);
    reset();
    setIsModalOpen(true);
  };

  const handleView = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsViewing(true);
    setDecryptedContent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsViewing(false);
    setValue('title', credential.title);
    setValue('description', credential.description);
    setValue('sensitiveContent', credential.sensitiveContent); 
    setValue('permission', credential.permission);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this credential?')) {
      deleteCredential(id);
    }
  };

  const handleShare = (credential: Credential) => {
    setSelectedCredential(credential);
    // Real app: open share modal
  };

  const requestDecryption = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmPassword = async (password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate verification
    if (password === 'admin123' || password === 'password') {
      setDecryptedContent(selectedCredential?.sensitiveContent || '');
    } else {
      throw new Error('Invalid password');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const onSubmit = (data: CredentialForm) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedCredential) {
        updateCredential(selectedCredential.id, {
          title: data.title,
          description: data.description,
          sensitiveContent: data.sensitiveContent,
          permission: data.permission,
        });
      } else {
        addCredential({
          title: data.title,
          description: data.description || '',
          sensitiveContent: data.sensitiveContent,
          permission: data.permission,
        });
      }

      setIsLoading(false);
      setIsModalOpen(false);
      reset();
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Credentials</h1>
          <p className="text-slate-500">Manage and share your encrypted information safely.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span>Create Credential</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search credentials by title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 shadow-sm transition-all"
          />
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Credentials List */}
      {filteredCredentials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCredentials.map(credential => (
            <CredentialCard 
              key={credential.id}
              credential={credential}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No credentials found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search or create a new one.</p>
          <button 
            onClick={handleOpenCreate}
            className="mt-6 font-bold text-slate-900 hover:underline"
          >
            Add your first credential
          </button>
        </div>
      )}

      {/* View/Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isViewing ? 'Credential Details' : (selectedCredential ? 'Edit Credential' : 'Create New Credential')}
        size="lg"
      >
        {isViewing && selectedCredential ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</p>
                <p className="text-lg font-bold text-slate-900">{selectedCredential.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Owner</p>
                <p className="text-slate-700">{selectedCredential.ownerName}</p>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</p>
                <p className="text-slate-600 leading-relaxed">{selectedCredential.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Key className="h-12 w-12 text-white/10" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    Sensitive Content
                  </h4>
                  {decryptedContent && (
                    <button 
                      onClick={() => copyToClipboard(decryptedContent, 'content')}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      {copiedId === 'content' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 font-mono text-lg break-all">
                  {decryptedContent ? (
                    <span className="text-emerald-400">{decryptedContent}</span>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <p className="text-white/30 mb-4 select-none italic text-sm tracking-widest">••••••••••••••••</p>
                      <button 
                        onClick={requestDecryption}
                        className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Reveal Content
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              {selectedCredential.isOwner && (
                <button 
                  onClick={() => setIsConfirmOpen(true)}
                  className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Manage Access
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Title</label>
              <input 
                {...register('title')}
                placeholder="e.g. Database Password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
              />
              {errors.title && <p className="text-xs text-rose-500 font-bold">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea 
                {...register('description')}
                placeholder="What is this credential used for?"
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Sensitive Content</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  {...register('sensitiveContent')}
                  type="password"
                  placeholder="The actual password or secret"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                />
              </div>
              {errors.sensitiveContent && <p className="text-xs text-rose-500 font-bold">{errors.sensitiveContent.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Default Permission</label>
                <select 
                  {...register('permission')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                >
                  <option value="READ_ONLY">Read Only</option>
                  <option value="READ_WRITE">Read & Write</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Share with (Email)</label>
                <input 
                  {...register('shareWith')}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (selectedCredential ? 'Save Changes' : 'Create Security Record')}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmPasswordModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmPassword}
      />
    </div>
  );
}
