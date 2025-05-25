import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "Alta" | "Media" | "Baja";
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter: string;
}

const priorityColors = {
  Alta: "text-red-600 bg-red-100 border border-red-300",
  Media: "text-yellow-600 bg-yellow-100 border border-yellow-300",
  Baja: "text-green-600 bg-green-100 border border-green-300",
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onToggle,
  onDelete,
  filter,
}) => {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Todas") return true;
    if (filter === "Pendientes") return !task.completed;
    if (filter === "Completadas") return task.completed;
    return true;
  });

  return (
    <ul className="space-y-3">
      {filteredTasks.map((task) => (
        <li
          key={task.id}
          className={`flex items-center justify-between bg-white p-3 rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg border border-gray-100`}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="accent-blue-500 w-5 h-5 cursor-pointer transition-all duration-150"
            />
            <span
              className={
                task.completed
                  ? "line-through text-gray-400 text-base font-medium"
                  : "text-gray-700 text-base font-medium"
              }
            >
              {task.text}
            </span>
            <span
              className={`ml-2 text-xs font-bold px-2 py-1 rounded-full ${
                priorityColors[task.priority]
              } shadow-sm`}
            >
              {task.priority}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task.id)}
              className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition-colors duration-150"
              title="Editar"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors duration-150"
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
