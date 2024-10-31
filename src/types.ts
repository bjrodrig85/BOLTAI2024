export type Status = 'backlog' | 'in-progress' | 'review' | 'done';
export type Role = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  departmentIds: string[];
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
  members: string[];
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string | null;
  departmentId: string;
  createdBy: string;
  createdAt: Date;
}

export interface Column {
  id: Status;
  title: string;
  tasks: Task[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}