import React, { createContext, useContext, useState, useEffect } from 'react';
import { Credential, User, Notification, UserRole } from '../types';
import { toast } from 'sonner';

interface DataContextType {
  credentials: Credential[];
  notifications: Notification[];
  users: User[];
  addCredential: (credential: Omit<Credential, 'id' | 'createdAt' | 'updatedAt' | 'ownerName' | 'isOwner'>) => void;
  updateCredential: (id: string, updates: Partial<Credential>) => void;
  deleteCredential: (id: string) => void;
  acceptInvitation: (notificationId: string, credentialId: string) => void;
  rejectInvitation: (notificationId: string) => void;
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@securevault.com', role: UserRole.ADMIN, isActive: true, createdAt: '2026-01-10T10:00:00Z' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@company.com', role: UserRole.USER, isActive: true, createdAt: '2026-02-15T14:30:00Z' },
  { id: 'u3', name: 'Emma Kawira', email: 'emma@company.com', role: UserRole.USER, isActive: true, createdAt: '2026-02-15T14:30:00Z' },
];

const mockCredentials: Credential[] = [
  {
    id: 'c1',
    title: 'Production Database',
    description: 'Main PostgreSQL instance for the customer portal.',
    sensitiveContent: 'db_pass_123456789',
    ownerId: 'u1',
    ownerName: 'Admin User',
    isOwner: true,
    permission: 'READ_WRITE',
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    title: 'Stripe API Key',
    description: 'Secret key for payment processing integration.',
    sensitiveContent: 'sk_test_51Mz...7j2',
    ownerId: 'u2',
    ownerName: 'Jane Smith',
    isOwner: false,
    permission: 'READ_ONLY',
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockNotifications: Notification[] = [
  { 
    id: 'n1', 
    userId: 'u1',
    type: 'INVITATION', 
    message: 'Jane Smith invited you to view "AWS Production Keys".', 
    relatedId: 'c101',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  { 
    id: 'n2', 
    userId: 'u1',
    type: 'ACCEPTANCE', 
    message: 'Emma Kawira accepted your invite to "Stripe Secret Key".', 
    isRead: true,
    createdAt: new Date().toISOString(),
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const addCredential = (data: any) => {
    const newCred: Credential = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      ownerId: 'u1',
      ownerName: 'Admin User',
      isOwner: true,
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCredentials(prev => [newCred, ...prev]);
    toast.success('Credential created successfully');
  };

  const updateCredential = (id: string, updates: Partial<Credential>) => {
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    toast.success('Credential updated');
  };

  const deleteCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id));
    toast.success('Credential deleted');
  };

  const acceptInvitation = (notificationId: string, credentialId: string) => {
    // In a real app, this would fetch the credential from backend
    const newCred: Credential = {
      id: credentialId,
      title: 'Shared Resource',
      description: 'Accepted from invitation',
      sensitiveContent: 'shared_secret_123',
      ownerId: 'u2',
      ownerName: 'Jane Smith',
      isOwner: false,
      permission: 'READ_ONLY',
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCredentials(prev => [newCred, ...prev]);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    toast.success('Invitation accepted');
  };

  const rejectInvitation = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.error('Invitation declined');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addUser = (data: any) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
    toast.success('User provisioned successfully');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    toast.success('User updated');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User deleted');
  };

  return (
    <DataContext.Provider value={{
      credentials,
      notifications,
      users,
      addCredential,
      updateCredential,
      deleteCredential,
      acceptInvitation,
      rejectInvitation,
      markNotificationRead,
      deleteNotification,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
