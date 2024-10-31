import React, { useState } from 'react';
import { Plus, LogOut, Settings } from 'lucide-react';
import { Column } from './components/Column';
import { NewTaskModal } from './components/NewTaskModal';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DepartmentForm } from './components/departments/DepartmentForm';
import { DepartmentList } from './components/departments/DepartmentList';
import { UserManagement } from './components/admin/UserManagement';
import { useAuth } from './context/AuthContext';
import type { Task, Column as ColumnType, Department } from './types';

const initialColumns: ColumnType[] = [
  { id: 'backlog', title: 'Backlog', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

function App() {
  const { user, isAuthenticated, logout, updateUserRole, assignToDepartment, removeFromDepartment } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ColumnType['id']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    setColumns(prevColumns => {
      const allTasks = prevColumns.flatMap(col => col.tasks);
      const task = allTasks.find(t => t.id === taskId);
      
      if (!task) return prevColumns;

      return prevColumns.map(col => ({
        ...col,
        tasks: col.id === targetStatus
          ? [...col.tasks, { ...task, status: targetStatus }]
          : col.tasks.filter(t => t.id !== taskId)
      }));
    });
  };

  const handleNewTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'departmentId' | 'assignedTo'>) => {
    if (!user || !selectedDepartment) return;

    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      createdBy: user.id,
      departmentId: selectedDepartment,
      assignedTo: null,
    };

    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === taskData.status
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );
  };

  const handleNewDepartment = (departmentData: Omit<Department, 'id' | 'createdAt' | 'managerId' | 'members'>) => {
    const newDepartment: Department = {
      ...departmentData,
      id: Math.random().toString(36).substr(2, 9),
      managerId: user?.id || null,
      members: [],
      createdAt: new Date(),
    };

    setDepartments(prev => [...prev, newDepartment]);
  };

  const canViewDepartment = (departmentId: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.departmentIds.includes(departmentId);
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <div>
        <RegisterForm />
        <p className="text-center mt-4">
          Already have an account?{' '}
          <button
            onClick={() => setShowRegister(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            Sign in
          </button>
        </p>
      </div>
    ) : (
      <div>
        <LoginForm />
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <button
            onClick={() => setShowRegister(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Register
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowUserManagement(!showUserManagement)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Settings size={20} className="mr-2" />
                  User Management
                </button>
              )}
              <button
                onClick={() => setIsDepartmentModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={20} className="mr-2" />
                New Department
              </button>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!selectedDepartment || !canViewDepartment(selectedDepartment)}
              >
                <Plus size={20} className="mr-2" />
                New Task
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showUserManagement && user?.role === 'admin' ? (
          <UserManagement
            users={[]}
            departments={departments}
            onUpdateUserRole={updateUserRole}
            onAssignDepartment={assignToDepartment}
            onRemoveFromDepartment={removeFromDepartment}
          />
        ) : (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <DepartmentList
                departments={departments.filter(d => 
                  user?.role === 'admin' || user?.departmentIds.includes(d.id)
                )}
                onSelect={setSelectedDepartment}
              />
            </div>
            <div className="col-span-3">
              {selectedDepartment && canViewDepartment(selectedDepartment) ? (
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {columns.map(column => (
                    <Column
                      key={column.id}
                      column={{
                        ...column,
                        tasks: column.tasks.filter(
                          task => task.departmentId === selectedDepartment
                        ),
                      }}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500">
                    {selectedDepartment
                      ? "You don't have access to this department"
                      : "Select a department to view its tasks"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleNewTask}
      />

      <DepartmentForm
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        onSubmit={handleNewDepartment}
      />
    </div>
  );
}

export default App;