import React from 'react';
import { MoreVertical, AlertCircle, Clock } from 'lucide-react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 truncate flex-1">{task.title}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock size={14} />
          <span className="text-xs">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}