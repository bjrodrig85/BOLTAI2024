import React from 'react';
import { TaskCard } from './TaskCard';
import type { Column as ColumnType } from '../types';

interface ColumnProps {
  column: ColumnType;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: ColumnType['id']) => void;
}

export function Column({ column, onDragStart, onDragOver, onDrop }: ColumnProps) {
  const columnColors = {
    backlog: 'bg-gray-100',
    'in-progress': 'bg-blue-50',
    review: 'bg-yellow-50',
    done: 'bg-green-50',
  };

  return (
    <div
      className={`flex flex-col flex-1 min-w-[300px] ${columnColors[column.id]} rounded-lg p-4`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">{column.title}</h2>
        <span className="bg-white px-2 py-1 rounded-full text-sm text-gray-600">
          {column.tasks.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}