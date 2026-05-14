import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  MoreVertical, 
  UserCheck, 
  UserMinus,
  Edit2,
  Trash2,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { User, UserRole } from '../types';
import { Modal } from '../components/Modal';
import { cn, formatDate } from '../utils';
import { useData } from '../context/DataContext';

export default function AdminPanelPage() {
  const { users, toggleUserStatus, deleteUser, credentials } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (id: string) => {
    toggleUserStatus(id);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-slate-500">Manage users, security protocols, and system health.</p>
        </div>
        <button 
          onClick={handleCreateUser}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <UserPlus className="h-5 w-5" />
          <span>Provision User</span>
        </button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
            <Users className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-500">Total System Users</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
            <UserCheck className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-500">Active Users</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{users.filter(u => u.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
            <Shield className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-500">Total Credentials</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{credentials.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900">User Management</h3>
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border",
                      user.role === UserRole.ADMIN ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-200 text-slate-500"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        user.isActive ? "bg-emerald-500" : "bg-rose-500"
                      )} />
                      <span className="text-sm text-slate-600">{user.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleActive(user.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          user.isActive ? "text-rose-500 hover:bg-rose-50" : "text-emerald-500 hover:bg-emerald-50"
                        )}
                        title={user.isActive ? 'Deactivate Account' : 'Activate Account'}
                      >
                        {user.isActive ? <UserMinus className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Activity className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="font-bold text-slate-900">System Activity Logs</h3>
          </div>
          <button className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1">
            Export Logs <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { action: 'Admin Login', user: 'admin@securevault.com', ip: '192.168.1.1', time: 'Just now' },
            { action: 'User Creation', user: 'admin@securevault.com', ip: '192.168.1.1', time: '14 mins ago' },
            { action: 'Failed Login Attempt', user: 'unknown@user.com', ip: '45.12.33.10', time: '2 hours ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono px-2 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-200">{log.ip}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.user}</p>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{log.time}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        title={selectedUser ? 'Edit User Profile' : 'Provision New System User'}
      >
        <div className="space-y-6">
           <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Full Name</label>
            <input 
              defaultValue={selectedUser?.name}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <input 
              defaultValue={selectedUser?.email}
              type="email"
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">System Role</label>
            <select 
              defaultValue={selectedUser?.role}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
            >
              <option value="USER">Standard User</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-4">
            <button 
              onClick={() => setIsUserModalOpen(false)}
              className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button 
              className="flex-1 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800"
            >
              {selectedUser ? 'Update User' : 'Create User'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
