import React, { useState } from 'react';
import { UserPlus, Edit2, X } from 'lucide-react';
import type { User, Department } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface UserManagementProps {
  users: User[];
  departments: Department[];
  onUpdateUserRole: (userId: string, role: User['role']) => void;
  onAssignDepartment: (userId: string, departmentId: string) => void;
  onRemoveFromDepartment: (userId: string, departmentId: string) => void;
}

export function UserManagement({
  departments,
  onUpdateUserRole,
  onAssignDepartment,
  onRemoveFromDepartment,
}: UserManagementProps) {
  const { getAllUsers, register } = useAuth();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' as const,
  });
  const [error, setError] = useState('');

  const users = getAllUsers();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(newUser.email, newUser.password, newUser.name, newUser.role);
      setShowNewUserModal(false);
      setNewUser({ email: '', password: '', name: '', role: 'user' });
      setError('');
    } catch (err) {
      setError('Failed to create user');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowNewUserModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <UserPlus size={20} className="mr-2" />
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <select
                      value={user.role}
                      onChange={(e) => {
                        onUpdateUserRole(user.id, e.target.value as User['role']);
                        setEditingUser(null);
                      }}
                      className="text-sm border rounded-md px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-500">{user.role}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <select
                    multiple
                    value={user.departmentIds}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions);
                      const currentDepts = new Set(user.departmentIds);
                      
                      options.forEach(option => {
                        if (!currentDepts.has(option.value)) {
                          onAssignDepartment(user.id, option.value);
                        }
                      });
                      
                      user.departmentIds.forEach(deptId => {
                        if (!options.find(opt => opt.value === deptId)) {
                          onRemoveFromDepartment(user.id, deptId);
                        }
                      });
                    }}
                    className="text-sm border rounded-md px-2 py-1"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingUser(user.id)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Add New User</h2>
              <button
                onClick={() => setShowNewUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-4 space-y-4">
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}