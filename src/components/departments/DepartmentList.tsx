import React from 'react';
import { Users } from 'lucide-react';
import type { Department } from '../../types';

interface DepartmentListProps {
  departments: Department[];
  onSelect: (departmentId: string) => void;
}

export function DepartmentList({ departments, onSelect }: DepartmentListProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {departments.map((department) => (
          <li
            key={department.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(department.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {department.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {department.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}