/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type Permission = 'READ_ONLY' | 'READ_WRITE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Credential {
  id: string;
  title: string;
  description: string;
  sensitiveContent: string; // Encrypted string
  ownerId: string;
  ownerName: string;
  isOwner: boolean;
  permission: Permission;
  sharedWith: SharedWith[];
  createdAt: string;
  updatedAt: string;
}

export interface SharedWith {
  userId: string;
  userName: string;
  email: string;
  permission: Permission;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'INVITATION' | 'ACCEPTANCE' | 'SYSTEM';
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalCredentials: number;
  sharedWithMe: number;
  pendingInvitations: number;
  activeUsers?: number; // Admin only
}
